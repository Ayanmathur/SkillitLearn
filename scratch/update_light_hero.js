const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'src', 'app', '(main)', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Replace dark-only hero section styling with dynamic Light/Dark theme styling
content = content.replace(
  `section className="relative bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e] to-[#141627] text-white overflow-hidden py-20 md:py-28 lg:py-32"`,
  `section className="relative bg-gradient-to-b from-green-50/80 via-white to-surface dark:from-[#1a1a2e] dark:via-[#1a1a2e] dark:to-[#141627] text-text-primary dark:text-white overflow-hidden py-20 md:py-28 lg:py-32 transition-colors duration-300"`
);

content = content.replace(
  `<div className="absolute inset-0 opacity-20 pointer-events-none">`,
  `<div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">`
);

content = content.replace(
  `<div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />`,
  `<div className="absolute top-0 right-0 w-96 h-96 bg-[#5bbd72]/30 dark:bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />`
);

content = content.replace(
  `<div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />`,
  `<div className="absolute bottom-0 left-0 w-80 h-80 bg-[#45bdff]/30 dark:bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />`
);

// Update text readability for sub-headline in light mode
content = content.replace(
  `p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl"`,
  `p className="text-lg md:text-xl text-text-secondary dark:text-white/80 mb-8 leading-relaxed max-w-2xl"`
);

// Update feature list item text color for light mode
content = content.replace(
  `ul className="grid sm:grid-cols-2 gap-3 mb-10 text-sm font-medium text-white/90"`,
  `ul className="grid sm:grid-cols-2 gap-3 mb-10 text-sm font-medium text-text-secondary dark:text-white/90"`
);

// Update secondary CTA button style for light mode
content = content.replace(
  `className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20`,
  `className="inline-flex items-center gap-2 bg-surface hover:bg-surface-raised dark:bg-white/10 dark:hover:bg-white/20 text-text-primary dark:text-white border border-border-color dark:border-white/20`
);

fs.writeFileSync(pagePath, content, 'utf8');
console.log('Successfully updated homepage hero section for Light & Dark mode!');
