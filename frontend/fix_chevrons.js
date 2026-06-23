const fs = require('fs');

const file = 'c:/Users/Jmpan/OneDrive/Desktop/Image Converter/frontend/src/sections/HomePage/Hero/index.jsx';
let content = fs.readFileSync(file, 'utf-8');

// Replace Chevron in Convert From box
content = content.replace(
  `{!file && <ChevronDown size={13} className="mt-1 text-slate-400" />}`,
  `<ChevronDown size={18} className="mt-2 text-slate-300 opacity-80" style={{ transform: isSourceDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />`
);

// Replace Chevron in Convert To box
content = content.replace(
  `{hasConversions && <ChevronDown size={13} className="mt-1 text-cyan-400/80 animate-pulse" />}`,
  `{hasConversions && <ChevronDown size={18} className="mt-2 text-cyan-400 opacity-90" style={{ transform: isTargetDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />}`
);

fs.writeFileSync(file, content, 'utf-8');
console.log("Chevrons successfully replaced.");
