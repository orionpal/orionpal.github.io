

// This is legacy code, used for delfina's bookclub presentation

console.log("hey the script is working")
        document.getElementById('fileInput').onchange = function() {
            var file = this.files[0];
            if (!file) {
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const wordCount = countWords(text);
                displayWordCount(wordCount);
            };
            reader.readAsText(file);
            };

        const wordCounts = {};
        
        function countWords(text) {
            const words = text.match(/\b\w+\b/g) || [];
            const wordCounts = {};
            const commonWords = new Set(["as", "to", "of", "or", "it", "if", "the", "is", "at", "which", "on", "for", "and", "a", "in"]); // Add more words as needed

            words.forEach(word => {
                if (!commonWords.has(word.toLowerCase())) {
                    wordCounts[word.toLowerCase()] = (wordCounts[word.toLowerCase()] || 0) + 1;
                }
            });

            return wordCounts;
        }

        function displayWordCount(wordCounts) {
            const wordCountResults = document.getElementById('wordcountresults');
            wordCountResults.innerHTML = '';

            const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
            var counter = 0
            sortedWords.forEach(([word, count]) => {
                counter += 1;
                if (counter > 40) {
                    console.log("hey why not return")
                    return
                }
                else {
                    console.log(counter)
                    const p = document.createElement('p');
                    p.textContent = `${word}: ${count}`;
                    wordCountResults.appendChild(p);
                }
                
            });
        }