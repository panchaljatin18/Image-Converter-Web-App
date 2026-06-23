const fs = require('fs');
const filePath = 'c:\\Users\\Jmpan\\OneDrive\\Desktop\\Image Converter\\frontend\\.next\\server\\chunks\\ssr\\src_sections_HomePage_Hero_index_jsx_04u1myz._.js';

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  const index = content.indexOf('Convert From');
  if (index !== -1) {
    // Extract a range of 15,000 characters around it
    const start = Math.max(0, index - 5000);
    const end = Math.min(content.length, index + 10000);
    let rawSegment = content.substring(start, end);
    
    // Simple formatter: add newlines after semicolons, commas, braces
    let formatted = rawSegment
      .replace(/([;{}])/g, '$1\n')
      .replace(/(children:)/g, '\n$1')
      .replace(/(className:)/g, '\n$1')
      .replace(/(style:)/g, '\n$1');
      
    fs.writeFileSync('C:\\Users\\Jmpan\\OneDrive\\Desktop\\Image Converter\\panel_segment.txt', formatted, 'utf8');
    console.log('Formatted segment saved successfully!');
  } else {
    console.log('Convert From not found');
  }
} else {
  console.log('File does not exist');
}
