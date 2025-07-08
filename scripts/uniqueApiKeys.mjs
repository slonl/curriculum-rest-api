import fs from 'fs';
import path from 'path';

const logDirectory = '../logs/';
const logFilePattern = /^apiAccess\d{4}-\d{2}-\d{2}\.txt$/; 
const outputFilePath = '../logs/uniqueUsers.txt';

try {
   
    const files = fs.readdirSync(logDirectory);
    
    const matchingFiles = files.filter(file => logFilePattern.test(file));
    
    if (matchingFiles.length === 0) {
        console.error(`No log files found matching pattern in directory: ${logDirectory}`);
        console.error('Expected pattern: apiAccessYYYY-MM-DD.txt');
        process.exit(1);
    }
    
    console.log(`Found ${matchingFiles.length} matching log files:`);
    matchingFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');
    
    const uniqueEntries = new Set();
    
    matchingFiles.forEach(filename => {
        const filePath = path.join(logDirectory, filename);
        console.log(`Processing: ${filename}`);
        
        try {
            const logContent = fs.readFileSync(filePath, 'utf8');
            
            const lines = logContent.split('\n').filter(line => line.trim() !== '');
            
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    uniqueEntries.add(trimmedLine);
                }
            });
            
            console.log(`  - Found ${lines.length} entries`);
            
        } catch (fileError) {
            console.error(`  - Error reading file ${filename}: ${fileError.message}`);
        }
    });
    
    const uniqueArray = Array.from(uniqueEntries).sort();
    
    const outputContent = uniqueArray.join('\n');
    fs.writeFileSync(outputFilePath, outputContent);
    
    console.log(`\nTotal unique user-apikey combinations found: ${uniqueArray.length}`);
    uniqueArray.forEach(entry => console.log(entry));
    console.log(`\nResults written to ${outputFilePath}`);
    
} catch (error) {
    if (error.code === 'ENOENT') {
        console.error(`Error: Directory '${logDirectory}' not found.`);
        console.error('Please make sure the directory exists or update the logDirectory variable.');
    } else {
        console.error('Error processing files:', error.message);
    }
}