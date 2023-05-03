<script>
import FindWordWorker from './worker.js?worker';

const worker = new FindWordWorker()

const sentence = "Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
let word = "peice for";
let workerLoaded = false;
// const worker = new Worker(new URL('./worker.js', import.meta.url))
let indexes = []
worker.addEventListener("message", (event) => {
  console.log(event.data)
  indexes = event.data;
  workerLoaded = true;
});

$: {
  worker.postMessage({ sentence, word });
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

{#if indexes.length > 0}
  <p class="text-gray-300 text-sm">Found word at indexes: {indexes.join(", ")}</p>
{:else if workerLoaded}
  <p class="text-gray-300 text-sm">Word not found</p>
{:else}
  <p class="text-gray-300 text-sm">Loading...</p>
{/if}

<p class="font-code text-2xl mt-4">
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
