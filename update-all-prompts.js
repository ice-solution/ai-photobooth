const fs = require('fs');
const path = require('path');

// 讀取 generate.js 文件
const generatePath = path.join(__dirname, 'routes', 'generate.js');
let content = fs.readFileSync(generatePath, 'utf8');

// 定義高質量關鍵詞
const highQualityKeywords = 'ultra high quality, 8k resolution, highly detailed, photorealistic, professional photography, studio lighting';

// 更新所有職業提示詞
const professionUpdates = [
  { old: 'high quality, detailed, realistic, natural lighting, inspiring for teenagers', new: 'ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting' },
  { old: 'high quality, detailed, realistic, natural lighting, inspiring for teenagers,', new: 'ultra high quality, 8k resolution, highly detailed, photorealistic, natural lighting, inspiring for teenagers, professional photography, studio lighting,' }
];

// 應用更新
professionUpdates.forEach(update => {
  content = content.replace(new RegExp(update.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), update.new);
});

// 寫回文件
fs.writeFileSync(generatePath, content, 'utf8');

console.log('✅ 所有職業提示詞已更新為高質量版本');
console.log('🎯 新增關鍵詞:', highQualityKeywords);
