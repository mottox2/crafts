
<script>
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
      patterns = patterns.concat(foundPatterns);
    }
  }

  return patterns.length ? patterns : null;
}
function bestPattern(patterns, method) {
  if (method === "minDistance") {
    return patterns.reduce((best, current) => {
      const bestDistance = best[best.length - 1] - best[0];
      const currentDistance = current[current.length - 1] - current[0];
      return bestDistance < currentDistance ? best : current;
    });
  } else if (method === "maxDistance") {
    return patterns.reduce((best, current) => {
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
  if (!patterns) {
    return null;
  }
  return bestPattern(patterns, evaluationMethod);
}


const sentence = "hello world";
const indexes = findBestWordInSentence(sentence, "eol", "maxDistance")

// 入力欄を見ても何をやっていいかわからんので、ランダムボタン I'm feeling lucky を作る
// 画面表示時、最初は普通のシンタックスハイライトが入っていて　
// キーボードの入力音とともに、inputタグが増える→Enterキーが押される演出→シンタックスハイライトが消えて単語がハイライトされる。

// 未確定
// 指定した単語が見つからなかった場合
</script>

{#if indexes}
  <p>Found word at indexes: {indexes.join(", ")}</p>
{:else}
  <p>Word not found</p>
{/if}

<p class="font-code">
{#each sentence as letter, i}
  {#if indexes && indexes.includes(i)}
    <span style="background-color: yellow">{sentence[i]}</span>
  {:else}
    {sentence[i]}
  {/if}
{/each}
</p>
```

<style>
  .font-code {
    font-family: 'Source Code Pro', monospace;
  }
</style>
