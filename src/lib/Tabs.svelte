<script>
  import { quintOut } from "svelte/easing";
  import { fly, fade, slide, crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount, afterUpdate } from "svelte";

  import { refresh, icon_list, icon_yet, icon_know } from "./icons.js";
  import { removeFromList, addToList } from "./func.js";
  import { btnStyle, subBtnStyle, footBtnStyle } from "./style.js";
  import { ori_items } from "./word/wordList_endGame.js";

  //

  export let tabs = [
    { label: "Checks", icon: icon_list, value: 1 },
    { label: "Yets", icon: icon_yet, value: 2 },
    { label: "Knows", icon: icon_know, value: 3 },
  ];

  export let activeTabValue = 1;
  export let tabRight = true;
  export const handleClick = (tabValue) => {
    tabValue > activeTabValue ? (tabRight = true) : (tabRight = false);
    return (activeTabValue = tabValue);
  };

  export let fullList = JSON.parse(JSON.stringify(ori_items)); // 깊은 복사
  export let checks = [];
  export let knows = [];
  export let yets = [];

  // Save
  $: localStorage.setItem("fullList", fullList.length);
  $: localStorage.setItem("knows", JSON.stringify(knows));
  $: localStorage.setItem("yets", JSON.stringify(yets));

  // Refresh
  function refreshList() {
    fullList = JSON.parse(JSON.stringify(ori_items)); // 깊은 복사
    checks = [];
    knows = [];
    yets = [];
    fillChecks();
  }

  // Fill checks
  function fillChecks() {
    for (let i = 0; i < 5; i++) {
      checks.push(fullList.shift());
    }
  }

  // Load
  function loadStatus() {
    try {
      if (
        !localStorage.getItem("knows") ||
        localStorage.getItem("knows") === "[]" ||
        !localStorage.getItem("yets") ||
        localStorage.getItem("yets") === "[]"
      ) {
        refreshList();
        fillChecks();
      } else {
        knows = JSON.parse(localStorage.getItem("knows"));
        yets = JSON.parse(localStorage.getItem("yets"));
        fullList = fullList.slice(0, knows.length + yets.length);
        fillChecks();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Button status
  let wordStatus;
  let meanStatus;
  let subBtnStatus;
  function refreshStatus() {
    wordStatus = new Array(checks.length).fill(false);
    meanStatus = new Array(checks.length).fill(false);
    subBtnStatus = new Array(checks.length).fill(false);
  }

  let selected;

  function updateKnows() {
    let toKnow = checks.shift();
    knows = [...knows, toKnow];
    let toCheck = fullList.shift();
    checks = [...checks, toCheck];
    selected = checks[0].word;
  }

  function updateYets() {
    let toYet = checks.shift();
    yets = [...yets, toYet];
    let toCheck = fullList.shift();
    checks = [...checks, toCheck];
    selected = checks[0].word;
  }

  onMount(() => {
    loadStatus();
    refreshStatus();
    selected = checks[0].word;
  });
</script>

<div class="topTabs w-screen fixed top-0 left-0 right-0 z-50 backdrop-blur">
  <ul class="justify-center mt-2 text-l text-slate-700">
    <button
      class="mr-2 hover:scale-90 active:scale-90 active:-rotate-180 transition-all ease-in-out duration-300"
      on:click={refreshList}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="inline-block h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d={refresh}
        />
      </svg>
    </button>
    {#each tabs as tab}
      <li class={activeTabValue === tab.value ? "active" : ""}>
        <span class="tabs" on:click={handleClick(tab.value)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="inline h-6 w-6"
            fill="none"
            viewBox="2 2 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d={tab.icon}
            />
          </svg>
          {tab.label}
        </span>
      </li>
    {/each}
  </ul>
</div>

<!-- // -->

<div class="mt-3 mb-14">
  {#each tabs as tab}
    {#if activeTabValue == tab.value}
      <div
        class="mainBody"
        in:fly={tabRight
          ? {
              delay: 0,
              duration: 300,
              x: 500,
              opacity: 1,
              easing: quintOut,
            }
          : {
              delay: 0,
              duration: 300,
              x: -500,
              opacity: 1,
              easing: quintOut,
            }}
      >
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2 break-words">
          <!-- Tab1 -->
          {#if tab.value === 1}
            <div class="tab1Page pt-6 px-4 space-y-2">
              {#each checks as check, i (check)}
                <div
                  class="flex {btnStyle} grid text-lg {i === 0
                    ? 'bg-slate-100 text-slate-900 border-slate-500 border-4'
                    : ''}"
                  animate:flip={{ duration: 300 }}
                  in:fly|local={{ duration: 300 }}
                  out:fade|local={{ duration: 100 }}
                >
                  <div
                    class="mb-2 font-semibold text-xl border-b-2 {i === 0
                      ? 'border-b-slate-700'
                      : ''}"
                  >
                    {check.word}
                  </div>

                  {#each check.time as examNum, j (examNum)}
                    <div
                      class="text-sm my-2 font-normal border-b-2 {i === 0
                        ? 'border-b-slate-400'
                        : ''}"
                    >
                      {check.en[j]}
                    </div>
                  {/each}
                </div>
              {/each}
              <div
                class="fixed inset-x-0 bottom-0 w-screen backdrop-blur  items-center border-t-2"
              >
                <div class="text-slate-700 text-center font-semibold mt-1">
                  total: {fullList.length + checks.length} / {ori_items.length},
                  knows: {knows.length}, yets: {yets.length}
                </div>
                <div class="grid grid-flow-row auto-rows-max">
                  <button
                    on:click={updateKnows}
                    class="{subBtnStyle} mx-4 mb-1 mt-2 block"
                    >I know <span
                      class="inline-block text-2xl py-3 animate-bounce"
                      >{selected}</span
                    > !</button
                  >
                  <button
                    on:click={updateYets}
                    class="{subBtnStyle} mx-4 my-1 mb-2 py-3 block"
                    >not yet...</button
                  >
                </div>
              </div>
            </div>
          {/if}
          <!-- Tab1 -->

          <!-- Tab2 -->
          {#if tab.value === 2}
            <div class="tab2Page pt-6 px-4 space-y-2">
              <!-- {#each yets as yet, i (yet)}
                <div
                  class="flex {btnStyle} grid text-lg"
                  animate:flip={{ duration: 300 }}
                  in:fly|local={{ duration: 300 }}
                  out:fade|local={{ duration: 100 }}
                >
                  <div class="mb-2 font-semibold text-xl border-b-2">
                    {yet.word}
                  </div>

                  {#each yet.time as examNum, j (examNum)}
                    <div class="text-sm my-2 font-normal border-b-2">
                      {yet.en[j]}
                    </div>
                  {/each}
                </div>
              {/each} -->
            </div>
          {/if}

          <!-- Tab3 -->
          <!-- 리스트 저장 수정하고 나서 작업 -->
          {#if tab.value === 3}
            <div class="tab3Page pt-6 px-4 grid grid-cols-2">
              {#each knows as know, i (know)}
                <div
                  class="flex {btnStyle} grid text-lg"
                  animate:flip={{ duration: 300 }}
                  in:fly|local={{ duration: 300 }}
                  out:fade|local={{ duration: 100 }}
                >
                  <div class="mb-0 font-semibold text-xl border-b-2">
                    {know.word}
                  </div>

                  <!-- {#each know.time as examNum, j (examNum)}
                    <div class="text-sm my-2 font-normal border-b-2">
                      {know.en[j]}
                    </div>
                  {/each} -->
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  /* Tabs */
  .mainBody {
    margin-bottom: 10px;
    padding-top: 40px;
    padding-bottom: 40px;
    /* border: 1px solid #dee2e6; */
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    width: 30vw;
    margin-bottom: -1px;
    text-align: center;
    font-weight: 700;
  }
  /* .topTabs {
    overflow-x: hidden;
    overflow-y: hidden;
  } */
  span.tabs {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span.tabs:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span.tabs {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-12%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(+5%);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  .animate-bounce {
    animation: bounce 0.7s infinite;
  }

  .tab1Page {
    overflow: hidden;
  }
  .tab2Page {
    overflow-y: scroll;
    height: 96vh;
    padding-bottom: 4vh;
  }
  .tab3Page {
    overflow-y: scroll;
    height: 96vh;
    padding-bottom: 4vh;
  }
</style>
