const fs = require('fs');
const path = require('path');

const vueDemiPath = path.join(__dirname, 'node_modules', 'vue-demi', 'lib', 'index.mjs');

if (fs.existsSync(vueDemiPath)) {
  let content = fs.readFileSync(vueDemiPath, 'utf8');
  
  // 修复 Vue 导入
  content = content.replace(
    /import Vue from 'vue'/g,
    "import * as Vue from 'vue'"
  );
  
  // 修复导出问题
  content = content.replace(
    /export { Vue, /g,
    "export { Vue as default, "
  );
  
  fs.writeFileSync(vueDemiPath, content);
  console.log('✅ vue-demi 文件已成功修复');
} else {
  console.log('⚠️ vue-demi 文件未找到，跳过修复');
}