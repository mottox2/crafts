function findWordInSentence(sentence, word, currentIndex = 0, currentPattern = []) {
  if (word.length === 0) {
    return [currentPattern];
  }

  const char = word[0];
  const remainingWord = word.slice(1);
  let patterns = [];

  for (let i = currentIndex; i < sentence.length; i++) {
    if (sentence[i] === char) {
      const newPattern = currentPattern.concat(i);
      const foundPatterns = findWordInSentence(sentence, remainingWord, i + 1, newPattern);
      if (foundPatterns)
        patterns = patterns.concat(foundPatterns);
    }
  }

  return patterns.length ? patterns : [];
}
function bestPattern(patterns, method) {
  if (patterns.length === 0) {
    return null
  }
  if (method === "minDistance") {
    return patterns.reduce((best, current) => {
      const bestDistance = best[best.length - 1] - best[0];
      const currentDistance = current[current.length - 1] - current[0];
      return bestDistance < currentDistance ? best : current;
    });
  } else if (method === "maxDistance") {
    console.log(patterns)
    return patterns.reduce((best, current) => {
      // console.log({patterns, method, current})
      const bestDistance = best[best.length - 1] - best[0];
      const currentDistance = current[current.length - 1] - current[0];
      return bestDistance > currentDistance ? best : current;
    });
  } else { // "firstFound" or any other method
    return patterns[0];
  }
}

function findBestWordInSentence(sentence, word, evaluationMethod) {
  const patterns = findWordInSentence(sentence, word);
  return bestPattern(patterns, evaluationMethod);
}

self.onmessage = function (event) {
  const { sentence, word, evaluationMethod = 'maxDistance' } = event.data;
  const normalizedWord = word.toLowerCase().replace(/\s+/g, '');
  const firstResult = findBestWordInSentence(sentence, normalizedWord);
  self.postMessage({
    indexes: firstResult,
    word,
  })
  const result = findBestWordInSentence(sentence, normalizedWord, evaluationMethod);
  self.postMessage({
    indexes: result,
    word,
  })
};


