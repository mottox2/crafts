
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
    console.log({patterns})
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


const sentence = "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
let word = "peice for";
let indexes = null;
$: {
  indexes = findBestWordInSentence(sentence, [...word].join('').replace(/ /, ''), "maxDistance")
}

// 入力欄を見ても何をやっていいかわからんので、ランダムボタン I'm feeling lucky を作る
// 画面表示時、最初は普通のシンタックスハイライトが入っていて　
// キーボードの入力音とともに、inputタグが増える→Enterキーが押される演出→シンタックスハイライトが消えて単語がハイライトされる。
// VSCode風のフッダーをつけて言語切替できるようにするのは面白そう。
// 処理はWebWorkrに流す

// 未確定
// 指定した単語が見つからなかった場合
</script>

<input type="text" bind:value={word} class="text-2xl bg-gray-800 rounded-full px-4 py-2 w-full mb-1">

{#if indexes}
  <p class="text-gray-300 text-sm">Found word at indexes: {indexes.join(", ")}</p>
{:else}
  <p class="text-gray-300 text-sm">Word not found</p>
{/if}

<p class="font-code text-lg mt-4">
{#each sentence as letter, i}
  {#if indexes && indexes.includes(i)}
    <span class="bg-yellow-500">{sentence[i]}</span>
  {:else}
    {sentence[i]}
  {/if}
{/each}
</p>

<style>
  .font-code {
    font-family: 'Source Code Pro', monospace;
  }
</style>
