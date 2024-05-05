const fs = require('fs')
const path = require('path')

// Import clipboardy dynamically
import('clipboardy')
  .then((clipboardy) => {
    const directoryPath = path.join(__dirname, 'list')

    // Read directory
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return console.log('Unable to scan directory: ' + err)
      }

      // Start the markdown table
      let markdownTable =
        '| Name | 100g Price | 200g Price |\n| ---- | ---------- | ---------- |\n'

      files.forEach((file) => {
        if (file.endsWith('.md')) {
          // Escape pipes and create a link
          const displayName = file.replace(/\|/g, '\\|').slice(0, -3) // Remove the .md and escape pipes
          const urlPath = `./list/${encodeURIComponent(file)}`
          const price100g = 'N/A' // Example price, change logic here as needed
          const price200g = 'N/A' // Example price, change logic here as needed

          // Append to the markdown table
          markdownTable += `| [${displayName}](${urlPath}) | ${price100g} | ${price200g} |\n`
        }
      })

      // Output the complete table to the console
      console.log(markdownTable)

      // Copy the markdown table to the clipboard
      clipboardy.default.writeSync(markdownTable)
      console.log('Markdown table has been copied to the clipboard!')

      const catalogContent = `# List\n\n${markdownTable}`
      // Write the markdown table to a file named 'catalog.md'
      fs.writeFile('catalog.md', catalogContent, (err) => {
        if (err) {
          console.log('Error writing file:', err)
        } else {
          console.log('Markdown file created successfully!')
        }
      })
    })
  })
  .catch((e) => console.error('Failed to load module: ', e))
