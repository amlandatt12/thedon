import React from 'react';
import { Category, Tool } from '../types.ts';
import * as Icons from 'lucide-react';

// Import Master Components
import { TextTransformer, TextConverter, TextAnalyzer, TextGenerator } from './TextTools.tsx';
import { JsonTool, ColorConverter, HashGenerator, CodeMinifier, WebTools } from './DevTools.tsx';
import { PasswordGenerator, UUIDGenerator } from './GeneratorTools.tsx';
import { UnitConverter, DateCalculator, MathCalculator } from './MathTools.tsx';
import { ImageProcessor } from './ImageTools.tsx';
import { FileProcessor } from './FileTools.tsx';

// Placeholder for truly unimplemented tools
const ComingSoon = ({ name }: { name: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
      <Icons.Hammer size={48} className="text-slate-400" />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-200">{name}</h3>
    <p className="text-slate-500 max-w-md mb-8">
      This tool is being optimized for the new engine.
      It will be available in the next micro-update.
    </p>
  </div>
);

// --- SMART MAPPING LOGIC ---
const getComponentForTool = (id: string, name: string): React.ComponentType => {
  const n = name.toLowerCase();
  const i = id.toLowerCase();

  // --- TEXT TOOLS ---
  if (n.includes('case')) return () => <TextTransformer defaultMode={i.includes('camel') ? 'camel' : i.includes('snake') ? 'snake' : i.includes('kebab') ? 'kebab' : i.includes('pascal') ? 'pascal' : 'sentence'} />;
  if (n.includes('sort') || n.includes('order')) return () => <TextTransformer defaultMode="sort-alpha" />;
  if (n.includes('reverse')) return () => <TextTransformer defaultMode="reverse-text" />;
  if (n.includes('duplicate') || n.includes('dedup')) return () => <TextTransformer defaultMode="unique" />;
  if (n.includes('remove') && (n.includes('empty') || n.includes('line'))) return () => <TextTransformer defaultMode="empty" />;
  if (n.includes('remove') && n.includes('space')) return () => <TextTransformer defaultMode="trim" />;
  if (n.includes('slug')) return () => <TextTransformer defaultMode="slug" />;
  if (n.includes('mirror')) return () => <TextTransformer defaultMode="mirror" />;
  if (n.includes('scramble')) return () => <TextTransformer defaultMode="scramble" />;

  if (n.includes('word count') || n.includes('analyzer') || n.includes('stat') || n.includes('frequency')) return TextAnalyzer;

  if (n.includes('base64')) return () => <TextConverter defaultMode={n.includes('decode') ? 'base64-decode' : 'base64-encode'} />;
  if (n.includes('url') && (n.includes('encoder') || n.includes('decoder'))) return () => <TextConverter defaultMode={n.includes('decode') ? 'url-decode' : 'url-encode'} />;
  if (n.includes('html') && (n.includes('encode') || n.includes('decode'))) return () => <TextConverter defaultMode={n.includes('decode') ? 'html-decode' : 'html-encode'} />;
  if (n.includes('binary')) return () => <TextConverter defaultMode={n.includes('code') ? 'binary-encode' : 'binary-decode'} />; // broad match
  if (n.includes('hex')) return () => <TextConverter defaultMode="hex-encode" />;
  if (n.includes('rot13')) return () => <TextConverter defaultMode="rot13" />;
  if (n.includes('morse')) return () => <TextConverter defaultMode="morse" />;

  if (n.includes('lorem') || n.includes('random text') || n.includes('generator')) return () => <TextGenerator type={n.includes('lorem') ? 'lorem' : 'random'} />;

  // --- DEV TOOLS ---
  if (n.includes('json') && !n.includes('minifier')) return JsonTool;
  if (n.includes('color') || n.includes('rgb') || n.includes('hsl')) return ColorConverter;
  if (n.includes('hash') || n.includes('md5') || n.includes('sha')) return () => <HashGenerator alg={n.includes('256') ? 'SHA-256' : n.includes('512') ? 'SHA-512' : 'SHA-1'} />;
  if (n.includes('minifier') || n.includes('formatter') || n.includes('beautifier')) return () => <CodeMinifier lang={n.includes('css') ? 'css' : n.includes('html') ? 'html' : n.includes('sql') ? 'sql' : 'js'} />;
  if (n.includes('diff')) return () => <WebTools mode="diff" />;
  if (n.includes('user agent') || n.includes('ip') || n.includes('header')) return () => <WebTools mode="user-agent" />;

  // --- GENERATORS ---
  if (n.includes('password')) return PasswordGenerator;
  if (n.includes('uuid')) return UUIDGenerator;

  // --- IMAGE TOOLS ---
  if (n.includes('image') || n.includes('photo') || n.includes('picture')) {
    if (n.includes('compress')) return () => <ImageProcessor mode="compress" />;
    if (n.includes('resize') || n.includes('dimension')) return () => <ImageProcessor mode="resize" />;
    if (n.includes('filter') || n.includes('blur') || n.includes('grayscale') || n.includes('sepia') || n.includes('invert')) return () => <ImageProcessor mode="filter" />;
    if (n.includes('crop')) return () => <ImageProcessor mode="resize" />; // Fallback for now
    return () => <ImageProcessor mode="convert" />;
  }

  // --- MATH & FINANCE ---
  if (n.includes('converter') && (n.includes('weight') || n.includes('length') || n.includes('time') || n.includes('speed') || n.includes('area'))) {
    const cat = n.includes('weight') ? 'weight' : n.includes('time') ? 'time' : n.includes('digital') ? 'digital' : 'length'; // simplified
    return () => <UnitConverter defaultCategory={cat} />;
  }
  if (n.includes('age') || n.includes('date')) return () => <DateCalculator type={n.includes('age') ? 'age' : 'diff'} />;
  if (n.includes('calculator') || n.includes('percentage') || n.includes('interest') || n.includes('loan')) {
    let type = 'percentage';
    if (n.includes('loan') || n.includes('mortgage') || n.includes('emi')) type = 'loan';
    if (n.includes('compound') || n.includes('investment')) type = 'compound';
    if (n.includes('bmi')) type = 'bmi';
    if (n.includes('discount') || n.includes('sale')) type = 'discount';
    if (n.includes('margin') || n.includes('profit')) type = 'margin';
    return () => <MathCalculator type={type as any} />;
  }

  // --- PDF & FILES ---
  if (n.includes('pdf') || n.includes('file') || n.includes('csv') || n.includes('excel')) {
    return () => <FileProcessor mode={i} />;
  }

  // FALLBACK
  return () => <ComingSoon name={name} />;
};

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const createRegistry = (): Tool[] => {
  const tools: Tool[] = [];
  const popularTools = ['Text Case Converter', 'JSON Formatter', 'Password Generator', 'UUID Generator', 'Image Compressor', 'Unit Converter', 'Loan Calculator', 'BMI Calculator'];

  const addTools = (category: Category, defaultIcon: any, names: string[]) => {
    names.forEach(name => {
      const id = slugify(name);
      if (tools.some(t => t.id === id)) return;

      tools.push({
        id,
        name,
        description: `Professional free ${name}. Secure client-side execution.`,
        category,
        icon: defaultIcon,
        component: getComponentForTool(id, name),
        popular: popularTools.includes(name)
      });
    });
  };

  // CATEGORY 1: TEXT
  addTools(Category.TEXT, Icons.Type, [
    "Text Case Converter", "Sentence Case Converter", "Title Case Converter", "Uppercase to Lowercase", "Lowercase to Uppercase", "Random Case Generator", "Remove Extra Spaces", "Remove Line Breaks", "Add Line Numbers", "Word Counter", "Character Counter", "Keyword Density Checker", "Reading Time Calculator", "Readability Score Checker", "Grammar Rule Checker", "Duplicate Line Remover", "Sort Lines Alphabetically", "Reverse Text", "Text to Slug Converter", "URL Encoder", "URL Decoder", "HTML Encoder", "HTML Decoder", "Escape Unescape String", "JSON Formatter", "JSON Validator", "YAML to JSON Converter", "JSON to YAML Converter", "CSV to JSON Converter", "JSON to CSV Converter", "CSV to Excel Converter", "Excel to CSV Converter", "Text to Binary", "Binary to Text", "Text to Hex", "Hex to Text", "ROT13 Encoder", "Caesar Cipher Encoder", "Base64 Encode", "Base64 Decode", "Hash Generator MD5", "Hash Generator SHA1", "Hash Generator SHA256", "Password Strength Checker", "Lorem Ipsum Generator", "Random Sentence Generator", "Random Paragraph Generator", "Random Word Generator", "Plagiarism Pattern Checker", "Text Difference Checker", "Punctuation Remover", "Spell Check", "Word Frequency Analyzer", "Syllable Counter", "Acronym Generator", "Text Compressor", "Text Decompressor", "Text Rewriter", "Emoji Remover", "Emoji Extractor", "Email Extractor", "URL Extractor", "Phone Number Extractor", "Text Summarizer", "Text Expander", "Number Extractor", "Line Counter", "Find and Replace Tool", "Regex Tester", "Regex Generator", "Multiline to Single-line Converter", "Single-line to Multiline Converter", "Alphabetical Word Sorter", "Remove Duplicate Words", "Remove Empty Lines", "Text Column Splitter", "Text Column Merger", "Tab to Spaces Converter", "Quotes Remover", "Quotes Adder", "Sentence Splitter", "Paragraph Splitter", "CamelCase to SnakeCase", "SnakeCase to CamelCase", "KebabCase Converter", "Text Mirror Tool", "Text Scrambler", "Word Shuffler", "Character Shuffler", "Reverse Word Order", "Reverse Sentence Order", "Word Capitalizer", "Multi-language Static Translator", "PDF Text Extractor", "Simple Thesaurus", "Text Formatter", "Typing Test Tool", "Typing Speed Calculator", "Text Obfuscator", "Text Cleaner"
  ]);

  // CATEGORY 2: IMAGE
  addTools(Category.IMAGE, Icons.Image, [
    "Image Compressor", "Image Resizer", "Image Cropper", "Image Rotator", "Image Flipper", "Image Format Converter", "PNG to JPG", "JPG to PNG", "PNG to WebP", "JPG to WebP", "WebP to PNG", "Image to Base64", "Base64 to Image", "Image Color Picker", "Palette Generator", "Gradient Generator", "Image Blur Tool", "Image Sharpen Tool", "Image Brightness Adjuster", "Image Contrast Adjuster", "Image Saturation Adjuster", "Image Opacity Adjuster", "Image Watermark Tool", "Transparent Image Maker", "Image Pixelator", "Avatar Creator", "Favicon Generator", "Logo Generator", "Meme Generator", "Image Annotator", "Image Marker Tool", "QR Code to Image", "Barcode to Image", "Image Metadata Viewer", "EXIF Remover", "EXIF Editor", "Image Aspect Ratio Calculator", "Image Splitter", "Collage Maker", "Passport Photo Creator", "Thumbnail Generator", "Color Replace Tool", "Image Trimmer", "Image Background Color Changer", "Image Border Generator", "Rounded Corner Creator", "Sticker Maker", "SVG Optimizer", "SVG to PNG", "PNG to SVG", "SVG Editor", "Pixel Art Generator", "Image BW Converter", "Image Sepia Filter", "Image Inverter", "Photo Filter Effects", "Image Compressor Lossless", "Image Compressor Lossy", "Image Dimension Checker", "Image Quality Reducer", "Image Overlay Tool", "Image Collage Grid Maker", "Image Comparison Slider", "Long Screenshot Stitcher", "Manga Filter Generator", "Cartoonize Image", "Image Histogram Viewer", "Image CMYK Converter", "Image RGB Converter", "Image Extract Colors", "ICO Converter", "GIF to MP4", "MP4 to GIF", "Animated GIF Editor", "GIF Compressor", "GIF Speed Changer", "GIF Reverser", "Image Flipbook Maker", "3D Image Tilt Generator", "Noise Texture Generator", "Pattern Generator", "Pixel Grid Generator", "Image Masking Tool", "Photo Frame Generator", "Light Leak Effect Maker", "Glitch Effect Generator", "VHS Effect Maker", "Halftone Image Generator", "Comic Strip Creator", "QR Art Generator", "Image to ASCII", "ASCII to Image", "Photo Vignette Generator", "Bokeh Effect Generator"
  ]);

  // CATEGORY 3: PDF
  // CATEGORY 3: PDF (Lite / Client-Side Viable Only)
  addTools(Category.PDF, Icons.FileText, [
    "PDF Metadata Viewer", "PDF Metadata Editor", "PDF to Text Extractor"
  ]);

  // CATEGORY 4: DEV
  addTools(Category.DEV, Icons.Code2, [
    "HTML Minifier", "CSS Minifier", "JavaScript Minifier", "JSON Minifier", "HTML Beautifier", "CSS Beautifier", "JavaScript Beautifier", "JSON Beautifier", "YAML Beautifier", "SQL Beautifier", "XML Beautifier", "HTML Formatter", "CSS Formatter", "JS Formatter", "JavaScript Obfuscator", "JavaScript Deobfuscator", "UUID Generator", "GUID Generator", "JSON Validator", "XML Validator", "HTML Validator", "CSS Validator", "Cron Expression Parser", "Git Ignore Generator", "README Generator", "Code Diff Checker", "Folder Structure Generator", "HTACCESS Generator", "Robots txt Generator", "Sitemap Generator", "Responsive Breakpoint Tester", "Color Picker Tool", "Hex to RGB Converter", "RGB to Hex Converter", "HSL to RGB Converter", "Color Palette Generator", "Gradient Generator", "Box Shadow Generator", "Text Shadow Generator", "Border Radius Generator", "CSS Clip Path Generator", "CSS Animation Generator", "SVG Path Editor", "SVG Optimizer", "Favicon Generator", "Image to Base64 Converter", "Base64 to Image Converter", "Regex Tester", "Regex Generator", "JWT Decoder", "bcrypt Hash Generator", "SHA Hash Generator", "MD5 Hash Generator", "Unix Timestamp Converter", "Epoch Time Converter", "Base Converter", "JSON to TSV Converter", "CSV to SQL Converter", "SQL to CSV Converter", "JSON to PHP Array Converter", "JSON to Python Dict Converter", "JSON to CSharp Object Converter", "JSON to Java Class Converter", "JSON to Dart Class Converter", "JSON to Go Struct Converter", "HTML Escape Tool", "HTML Unescape Tool", "URL Parser Tool", "IP Address Validator", "Email Validator", "Password Generator", "JWT Generator", "Localhost Tunnel Tester", "HTTP Header Viewer", "User Agent Parser", "Robots txt Tester", "Meta Tag Generator", "Schema Markup Generator", "Open Graph Tag Generator", "Apple Touch Icon Generator", "Progressive Web App Manifest Generator", "JSON Pretty Print", "Code Counter", "Color Contrast Checker", "AB Testing Snippet Generator", "Lazy Loading Generator", "CDN URL Formatter", "URL Builder", "API Request Builder", "Markdown Editor", "Markdown to HTML", "HTML to Markdown", "Online Notepad", "Code Playground", "WebP Converter", "CSS Flexbox Visualizer", "CSS Grid Builder", "Minify Multiple Files Tool", "Combine JS Files", "Combine CSS Files"
  ]);

  // CATEGORY 5: MATH
  addTools(Category.MATH, Icons.Calculator, [
    "Age Calculator", "Date Difference Calculator", "Time Zone Converter", "World Clock Tool", "Countdown Timer", "Stopwatch", "Percentage Calculator", "Percentage Increase Calculator", "Percentage Decrease Calculator", "Fraction Calculator", "Decimal to Fraction Converter", "Fraction to Decimal Converter", "Loan Calculator", "Mortgage Calculator", "EMI Calculator", "Compound Interest Calculator", "Simple Interest Calculator", "ROI Calculator", "Profit Margin Calculator", "Discount Calculator", "Sale Price Calculator", "Tax Calculator", "Split Bill Calculator", "Tip Calculator", "GPA Calculator", "CGPA Calculator", "Body Mass Index Calculator", "Calorie Calculator", "Ideal Weight Calculator", "Protein Intake Calculator", "Pregnancy Due Date Calculator", "Ovulation Calculator", "Period Tracker", "Distance Calculator", "Speed Calculator", "Velocity Calculator", "Acceleration Calculator", "Unit Converter", "Length Converter", "Weight Converter", "Temperature Converter", "Pressure Converter", "Energy Converter", "Power Converter", "Area Converter", "Volume Converter", "Data Storage Converter", "Data Transfer Speed Converter", "Currency Converter", "LCM Calculator", "HCF Calculator", "Prime Number Checker", "Factor Finder", "Percentage to Decimal", "Decimal to Percentage", "Scientific Calculator", "Quadratic Equation Solver", "Equation Solver", "Triangle Calculator", "Circle Calculator", "Rectangle Calculator", "Square Calculator", "Cylinder Calculator", "Sphere Volume Calculator", "Surface Area Calculator", "BMI Percentile Calculator", "BMR Calculator", "Heart Rate Zone Calculator", "Macro Calculator", "Water Intake Calculator", "Sleep Cycle Calculator", "Baby Growth Percentile Calculator", "Savings Goal Calculator", "Investment Returns Calculator", "Inflation Calculator", "VAT Calculator", "GST Calculator", "Break even Calculator", "Salary Calculator", "Overtime Pay Calculator", "Time Card Calculator", "Hours to Minutes Converter", "Minutes to Hours Converter", "Seconds to Minutes Converter", "Time Duration Calculator", "Number System Converter", "Probability Calculator", "Statistical Mean Calculator", "Median Calculator", "Mode Calculator", "Standard Deviation Calculator", "Permutation Calculator", "Combination Calculator", "Ratio Calculator", "Proportion Calculator", "Random Number Generator", "Roman Numeral Converter", "Binary Calculator", "Hex Calculator", "String Length Calculator"
  ]);

  // CATEGORY 6: FINANCE
  addTools(Category.FINANCE, Icons.BadgeDollarSign, [
    "Business Loan Calculator", "Car Loan Calculator", "Home Loan Calculator", "Mortgage Refinance Calculator", "Interest Rate Calculator", "Investment Calculator", "Mutual Fund Returns Calculator", "SIP Calculator", "SWP Calculator", "Lump Sum Investment Calculator", "Retirement Calculator", "Pension Calculator", "401K Growth Calculator", "Savings Interest Calculator", "Credit Card Payoff Calculator", "Debt Snowball Calculator", "Debt Avalanche Calculator", "Loan Comparison Calculator", "Tax Bracket Calculator", "Hourly Wage Calculator", "Salary to Hourly Converter", "Hourly to Salary Converter", "Paycheck Calculator", "Pay Raise Calculator", "Inflation Adjustment Calculator", "Budget Planner Tool", "Expense Tracker", "Profit Calculator", "Gross Profit Calculator", "Net Profit Calculator", "Operating Margin Calculator", "Inventory Turnover Calculator", "Cost Price Calculator", "Selling Price Calculator", "Margin Calculator", "Markup Calculator", "COGS Calculator", "Vendor Payment Calculator", "Profit Split Calculator", "Freelance Rate Calculator", "Contract Pricing Calculator", "Production Cost Calculator", "ROI Calculator", "NPV Calculator", "IRR Calculator", "Payback Period Calculator", "Break even Point Calculator", "VAT Calculator", "GST Calculator", "Discount and Sale Price Tool", "Stock Profit Calculator", "Share Average Calculator", "Dividend Calculator", "CAGR Calculator", "Capital Gain Calculator", "Risk Calculator", "Mortgage Overpayment Calculator", "Amortization Table Generator", "EMI Schedule Generator", "Rental Yield Calculator", "Lease vs Buy Calculator", "Business Valuation Calculator", "Currency Converter", "Invoice Generator", "Estimate Generator", "Receipt Maker", "Quotation Generator", "Profit and Loss Statement Generator", "Balance Sheet Maker", "Cash Flow Statement Generator", "Budget vs Actual Tool", "Business Growth Rate Calculator", "Sales Tax Calculator", "Hourly Productivity Calculator", "Working Capital Calculator", "Contribution Margin Calculator", "Payroll Hour Calculator", "Contractor Cost Calculator", "Profit Margin by Industry", "Import Duty Calculator", "ROI vs NPV Comparison Tool", "Tip Distribution Calculator", "Partner Profit Sharing Calculator", "Loan EMI Split Calculator", "Business KPI Calculator", "Subscription Revenue Calculator", "SaaS Churn Calculator", "LTV Calculator", "CAC Calculator", "ARPU Calculator", "MRR Calculator", "ARR Calculator", "Inventory Calculator", "Bulk Discount Calculator", "Financial Ratio Calculator", "Debt to Income Calculator", "APR Calculator", "EPS Calculator", "Income Tax Estimator", "Business Hours Calculator"
  ]);

  // CATEGORY 10: GENERATORS
  addTools(Category.GENERATOR, Icons.Sparkles, [
    "QR Code Generator", "Barcode Generator", "Password Generator", "Username Generator", "Nickname Generator", "Random Name Generator", "Fake Name Generator", "Business Name Generator", "Domain Name Generator", "App Name Generator", "Color Palette Generator", "Gradient Generator", "Random Number Generator", "Random Word Generator", "Random Sentence Generator", "Random Paragraph Generator", "Story Idea Generator", "Writing Prompt Generator", "Slogan Generator", "Tagline Generator", "Meme Generator", "Wallpaper Generator", "Pattern Generator", "QR Art Generator", "Logo Generator", "Avatar Generator", "Pixel Art Generator", "ASCII Art Generator", "Emoji Art Generator", "Mandala Generator", "Doodle Generator", "Maze Generator", "Sudoku Generator", "Crossword Generator", "Word Search Generator", "Bingo Card Generator", "Flashcard Generator", "Dice Roller", "Tarot Card Generator", "Fortune Cookie Generator", "Horoscope Generator", "Random Decision Generator", "Coin Flip Tool", "Wheel of Names", "Bingo Spinner", "Birthday Message Generator", "Greeting Card Generator", "Invitation Generator", "Certificate Maker", "Calendar Generator", "ASCII Banner Generator", "Text Signature Generator", "QR Menu Creator", "Seating Plan Generator", "Tournament Bracket Generator", "Workout Generator", "Meal Plan Generator", "Meditation Script Generator", "Affirmations Generator", "Bucket List Creator", "Coupon Code Generator", "Serial Number Generator", "Key Generator", "Product Key Generator", "Lorem Ipsum Generator", "Country Flag Emoji Generator", "Map Coordinates Generator", "Planet Info Generator", "Trivia Question Generator", "Riddle Generator", "Joke Generator", "Pun Generator", "Insult Generator", "Compliment Generator", "Recipe Generator", "Gift Ideas Generator", "Baby Name Generator", "Pet Name Generator", "Team Name Generator", "Brand Name Generator", "Blog Topic Generator", "YouTube Title Generator", "Hashtag Generator", "Captcha Generator", "Color Namer Tool", "Sound Generator", "White Noise Generator", "Random Coordinates Generator", "Chemical Formula Generator", "Random Password Phrase Generator", "UUID Generator", "MAC Address Generator", "IP Address Generator", "CSS Art Generator", "SVG Shape Generator", "HTML Template Generator", "Code Snippet Generator", "Dice Probability Generator", "Present Ideas Generator", "Universal Random Generator Tool"
  ]);

  return tools;
};

export const toolsRegistry = createRegistry();
export const getToolsByCategory = (cat: Category) => toolsRegistry.filter(t => t.category === cat);
export const getPopularTools = () => toolsRegistry.filter(t => t.popular);