<script>
import FindWordWorker from './worker.js?worker';

const worker = new FindWordWorker()

const sentence = "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
let word = "piece for";
let workerLoaded = false;
let loading = false;
// const worker = new Worker(new URL('./worker.js', import.meta.url))
let indexes = []
let resultWord = ""
worker.addEventListener("message", (event) => {
  console.log(event.data)
  const { indexes: result, word: resultInput } = event.data;
  if (!result) {
    indexes = []
    loading = false
    return;
  };
  if (resultInput !== word) return;
  indexes = result;
  resultWord = resultInput;
  workerLoaded = true;
  loading = false
});

// define throttle
let timer = null;
function throttle(callback, interval) {
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(callback, interval);
}

$: {
  // 間引く
  throttle(() => {
    loading = true
    worker.postMessage({ sentence, word });
  }, 200)
  // worker.postMessage({ sentence, word });
}

// 入力欄を見ても何をやっていいかわからんので、ランダムボタン I'm feeling lucky を作る
// 画面表示時、最初は普通のシンタックスハイライトが入っていて　
// キーボードの入力音とともに、inputタグが増える→Enterキーが押される演出→シンタックスハイライトが消えて単語がハイライトされる。
// VSCode風のフッダーをつけて言語切替できるようにするのは面白そう。
// 入力も文章も小文字として扱うようにする
// 長い文章が入ると読み込みが長いので見せ方を検討、リアルタイム反映は難しいかも。計算量見積もりをしてローディングを出し分けるのも検討

// 未確定
// 指定した単語が見つからなかった場合
</script>

<div class="-mx-4">
  <input type="text" bind:value={word} class="text-3xl bg-gray-800 sm:rounded-lg -mt-4 sm:mt-0 py-2 w-full mb-2 py-4 px-4" placeholder="done is better than perfect">
</div>

{#if indexes.length > 0}
  <p class="text-gray-300 text-sm">Found word at indexes: {indexes.join(", ")}</p>
{:else if loading}
  <p class="text-gray-300 text-sm">Loading...</p>
{:else if workerLoaded}
  <p class="text-gray-300 text-sm">Word not found</p>
{:else}
  <p class="text-gray-300 text-sm">Loading...</p>
{/if}

<p class="font-code text-sky-400 text-lg sm:text-3xl sm:text-[2rem] sm:leading-snug mt-4" class:loading="{ loading || !workerLoaded }" >
{#each sentence as letter, i}
  {#if indexes && indexes.includes(i)}
    <span class="text-yellow-500">{sentence[i]}</span>
  {:else}
    {sentence[i]}
  {/if}
{/each}
{#if !loading && indexes && indexes.length > 0}
  <span class="bg-sky-400 text-white inline-flex">
    {#each resultWord.toUpperCase().split(" ") as w, i}
      {w}
      {#if i < resultWord.toUpperCase().split(" ").length - 1}
        <span class="mr-2"> </span>
      {/if}
    {/each}
  </span>
{/if}
</p>

<style>
  .font-code {
    font-family: 'Source Code Pro', monospace;
  }

  .loading {
    /* background: linear-gradient(to right, #FFF 20%, rgb(234 179 8) 40%, rgb(234 179 8) 60%, #FFF 80%); */
    background: linear-gradient(to right, rgb(14 165 233) 20%, rgb(14 165 233 / 0.6) 40%, rgb(14 165 233 / 0.6) 60%, rgb(14 165 233) 80%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shine 1s linear infinite;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
</style>
