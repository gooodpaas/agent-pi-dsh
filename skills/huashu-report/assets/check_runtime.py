"""Read-only dependency check; does not install software or contact a service."""
import importlib.util
import json
import shutil


def check_runtime():
    checks = {name: bool(shutil.which(name)) for name in ("pdfinfo", "pdftotext", "pdftoppm")}
    checks["python_playwright"] = importlib.util.find_spec("playwright") is not None
    checks["chromium"] = False
    if checks["python_playwright"]:
        from pathlib import Path
        from playwright.sync_api import sync_playwright
        with sync_playwright() as playwright:
            checks["chromium"] = Path(playwright.chromium.executable_path).is_file()
    return {"ready": all(checks.values()), "checks": checks}


if __name__ == "__main__":
    print(json.dumps(check_runtime(), ensure_ascii=False, indent=2))
