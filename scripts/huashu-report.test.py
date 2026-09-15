import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory
import xml.etree.ElementTree as ET

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'skills/huashu-report/assets'))
import chart
import render

class ReportAssetsTest(unittest.TestCase):
    def test_zero_values_have_distinct_ticks(self):
        svg = ET.fromstring(chart.paired_bars([('零值', 0, 0)]))
        ticks = [item.text for item in svg.findall('{http://www.w3.org/2000/svg}text') if item.attrib.get('text-anchor') == 'end']
        self.assertEqual(len(ticks), len(set(ticks)))

    def test_negative_bars_remain_inside_chart(self):
        svg = ET.fromstring(chart.paired_bars([('下降', -11, -5)]))
        bars = svg.findall('{http://www.w3.org/2000/svg}rect')
        self.assertEqual(len(bars), 2)
        for bar in bars:
            self.assertGreater(float(bar.attrib['height']), 0)
            self.assertGreaterEqual(float(bar.attrib['y']), 0)
            self.assertLessEqual(float(bar.attrib['y']) + float(bar.attrib['height']), 182)

    def test_toc_patch_keeps_utf8_generator(self):
        with TemporaryDirectory() as folder:
            path = Path(folder) / '中文 生成器.py'
            path.write_text('toc_row("摘要", "中文标题", 1)\n', encoding='utf-8')
            self.assertTrue(render.patch_toc(path, {'摘要': 8}))
            self.assertEqual(path.read_text(encoding='utf-8'), 'toc_row("摘要", "中文标题", 8)\n')
            self.assertFalse(render.patch_toc(path, {'摘要': 8}))

if __name__ == '__main__':
    unittest.main()
