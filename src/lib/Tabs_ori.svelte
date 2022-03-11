<script>
  import { quintOut } from "svelte/easing";
  import { fly, fade, slide, crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount, afterUpdate, beforeUpdate } from "svelte";

  import { refresh, icon_list, icon_yet, icon_know } from "./icons.js";
  import { btnStyle, subBtnStyle, footBtnStyle } from "./style.js";
  import { ori_items } from "./word/wordList_endGame.js";
  import InfiniteScroll from "./func/InfiniteScroll.svelte";

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
    if (tabValue === 2) {
      curr_yets = JSON.parse(localStorage.getItem("yets"));
      yets_scroll();
    }
    if (tabValue !== 2) {
      show_yets = [];
      update_show_yets = [];
      showYetPage = 0;
    }
    return (activeTabValue = tabValue);
  };

  // 무한 스크롤
  let showYetPage = 0;
  let showYetSize = 20;
  export let fullList = JSON.parse(JSON.stringify(ori_items)); // 깊은 복사
  export let checks = [];

  export let yets = [];
  let show_yets = [];
  let update_show_yets = [];
  let curr_yets = [];
  function yets_scroll() {
    update_show_yets = curr_yets.slice(
      showYetPage * showYetSize,
      (showYetPage + 1) * showYetSize
    );
  }
  $: show_yets = [...show_yets, ...update_show_yets];

  export let knows = [];

  export let selected;

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
    for (let i = 0; i < 10; i++) {
      checks.push(fullList.shift());
    }
    selected = checks[0].word;
  }

  // Load
  function loadStatus() {
    try {
      let chkKnows = JSON.parse(localStorage.getItem("knows"));
      let chkYets = JSON.parse(localStorage.getItem("yets"));
      if (
        // 1 + 1 ===
        // 2
        (chkKnows === null || chkKnows === undefined) &&
        (chkYets === null || chkYets === undefined)
      ) {
        refreshList();
      } else {
        knows = chkKnows;
        yets = chkYets;
        fullList = fullList.slice(knows.length + yets.length, fullList.length);
        fillChecks();
      }
    } catch (e) {
      console.error(e);
    }
  }
  loadStatus();

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

  function updateYetToKnows(index) {
    let toKnow = show_yets[index];
    knows = [...knows, toKnow];
    let yets1 = yets.slice(0, index);
    let yets2 = yets.slice(index + 1);
    yets = [...yets1, ...yets2];
    show_yets.splice(index, 1);
  }

  function updateKnowsToYet(index) {
    let toYet = knows[index];
    yets = [...yets, toYet];
    let knows1 = knows.slice(0, index);
    let knows2 = knows.slice(index + 1);
    knows = [...knows1, ...knows2];
  }

  let yetBtnStatus = {};
  function yetBtnToggle(index) {
    !yetBtnStatus[index]
      ? (yetBtnStatus[index] = true)
      : (yetBtnStatus[index] = false);
  }
  let knowBtnStatus = {};
  function knowBtnToggle(index) {
    !knowBtnStatus[index]
      ? (knowBtnStatus[index] = true)
      : (knowBtnStatus[index] = false);
  }

  onMount(() => {
    // yets_scroll();
    console.log("mount!");
  });

  // console.log("scriptEnd");
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

<div class="mb-14">
  {#each tabs as tab}
    {#if activeTabValue == tab.value}
      <div
        class="pt-9"
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
        <div class="grid pt-4 h-full break-words">
          <!-- Tab1 -->
          {#if tab.value === 1}
            <div class="tab1Page px-4 pt-4 space-y-2">
              <div class="grid mb-4 ">
                {#each checks as check, i (check)}
                  <div in:slide>
                    <div class="block text-left " transition:slide|local>
                      <div class="mb-2">
                        <div
                          class="flex {btnStyle} grid text-lg {i === 0
                            ? 'bg-slate-100 text-slate-900 border-slate-500 border-4'
                            : ''}"
                          in:fly|local={{ duration: 300 }}
                          out:fade|local={{ duration: 100 }}
                        >
                          <div
                            class="mb-2 font-semibold text-xl border-b-2 {i ===
                            0
                              ? 'border-b-slate-700'
                              : ''}"
                          >
                            {check.word}
                          </div>

                          {#each check.time as examNum, j (examNum)}
                            <div
                              class="text-sm my-2 font-normal border-b-2 {i ===
                              0
                                ? 'border-b-slate-400'
                                : ''}"
                            >
                              {check.en[j]}
                            </div>
                          {/each}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          {#if tab.value === 1}
            <div>
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
            <div class="tab2Page px-4">
              <div class="grid pt-2 mb-4 ">
                {#each show_yets as yet, i (yet)}
                  <div in:slide>
                    <div class="block text-left " transition:slide|local>
                      <div class="mb-2">
                        <div
                          class="{btnStyle} py-3 grid text-lg"
                          in:fly|local={{ duration: 300 }}
                          out:fade|local={{ duration: 100 }}
                        >
                          <button
                            class="text-left w-full"
                            on:click={() => {
                              yetBtnToggle(i);
                            }}
                          >
                            <div class="font-semibold text-xl border-b-2">
                              {yet.word}
                            </div>

                            {#each yet.time as examNum, j (examNum)}
                              <div class="text-xs mb-1 pt-3 font-normal">
                                {yet.time[j]}
                              </div>
                              <div
                                class="text-sm mb-2 font-semibold border-b-2"
                              >
                                {yet.en[j]}
                              </div>
                              <div
                                class="text-sm mt-0 mb-1 pl-2 font-normal border-b-2"
                              >
                                {yet.ko[j]}
                              </div>
                            {/each}
                            <div class="space-y-2 mt-2 text-center">
                              {#if yetBtnStatus[i]}
                                <div transition:slide|local={{ duration: 200 }}>
                                  <div
                                    class="{subBtnStyle} text-base py-1"
                                    on:click={updateYetToKnows(i)}
                                  >
                                    I know!
                                  </div>
                                </div>
                                <!-- <div transition:slide|local={{ duration: 200 }}>
                                  <div class="{subBtnStyle} text-base py-1">
                                    sound like...
                                  </div>
                                </div> -->
                              {/if}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
              <InfiniteScroll
                hasMore={update_show_yets.length}
                threshold={80}
                on:loadMore={() => {
                  showYetPage++;
                  yets_scroll();
                }}
              />
            </div>
          {/if}

          <!-- Tab3 -->
          {#if tab.value === 3}
            <div class="tab3Page px-4">
              <div class="pt-2 mb-4">
                <div class="grid grid-cols-2 gap-2 text-lg">
                  {#each knows as know, i (know)}
                    <div>
                      <div class="block text-left " transition:slide>
                        <div
                          class="flex {btnStyle} "
                          in:fly|local={{ duration: 300 }}
                          out:fade|local={{ duration: 100 }}
                        >
                          <button
                            class="text-left w-full"
                            transition:slide|local
                            on:click={() => {
                              knowBtnToggle(i);
                            }}
                          >
                            <div class="font-semibold text-xl border-b-2">
                              {know.word}
                            </div>
                            <div class="space-y-2 mt-2 text-center">
                              {#if knowBtnStatus[i]}
                                <div transition:slide|local>
                                  <div
                                    class="{subBtnStyle} text-base py-1"
                                    on:click={updateKnowsToYet(i)}
                                  >
                                    not yet...
                                  </div>
                                </div>
                                <!-- <div transition:slide|local>
                                  <div class="{subBtnStyle} text-base py-1">
                                    sound like...
                                  </div>
                                </div> -->
                              {/if}
                            </div></button
                          >
                          <!-- {#each know.time as examNum, j (examNum)}
                    <div class="text-sm my-2 font-normal border-b-2">
                      {know.en[j]}
                    </div>
                  {/each} -->
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
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
  .tab2Page,
  .tab3Page {
    overflow-y: scroll;
    height: 94vh;
    padding-top: 1vh;
    padding-bottom: 5vh;
  }
</style>
