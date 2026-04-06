<script lang="ts">
  import { onMount } from 'svelte'

  const STORAGE_KEY = 'neck-counter-state-v1'
  const INCREMENT_COOLDOWN_MS = 1000

  let count = 0
  let lastIncrementAt: number | null = null
  let cooldownRemainingMs = 0

  function loadState() {
    const savedState = localStorage.getItem(STORAGE_KEY)

    if (!savedState) {
      return
    }

    try {
      const parsed = JSON.parse(savedState) as {
        value?: number
        lastIncrementAt?: number | null
      }

      count = typeof parsed.value === 'number' ? parsed.value : 0
      lastIncrementAt =
        typeof parsed.lastIncrementAt === 'number' ? parsed.lastIncrementAt : null
    } catch {
      count = 0
      lastIncrementAt = null
    }
  }

  function persistState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        value: count,
        lastIncrementAt,
      }),
    )
  }

  function updateCooldown() {
    if (lastIncrementAt === null) {
      cooldownRemainingMs = 0
      return
    }

    cooldownRemainingMs = Math.max(
      0,
      INCREMENT_COOLDOWN_MS - (Date.now() - lastIncrementAt),
    )
  }

  function increment() {
    updateCooldown()

    if (cooldownRemainingMs > 0) {
      return
    }

    count += 1
    lastIncrementAt = Date.now()
    persistState()
    updateCooldown()
  }

  function decrement() {
    count = Math.max(0, count - 1)
    persistState()
  }

  function reset() {
    count = 0
    lastIncrementAt = null
    cooldownRemainingMs = 0
    persistState()
  }

  onMount(() => {
    loadState()
    updateCooldown()

    const timer = window.setInterval(updateCooldown, 100)

    return () => {
      window.clearInterval(timer)
    }
  })

  $: canIncrement = cooldownRemainingMs === 0
  $: cooldownSeconds = (cooldownRemainingMs / 1000).toFixed(1)
  $: incrementButtonClass = canIncrement
    ? 'group relative flex aspect-square w-full max-w-[20rem] items-center justify-center rounded-[2.6rem] border border-white/65 bg-white/35 px-6 shadow-[0_24px_90px_rgba(89,58,9,0.16)] backdrop-blur-xl transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-80'
    : 'group relative flex aspect-square w-full max-w-[20rem] items-center justify-center rounded-[2.6rem] border border-white/65 bg-white/35 px-6 shadow-[0_24px_90px_rgba(89,58,9,0.16)] backdrop-blur-xl transition ring-4 ring-amber-900/10 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-80'
</script>

<svelte:head>
  <title>Neck Counter</title>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  />
</svelte:head>

<main
  class="relative h-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(246,202,91,0.22),_transparent_34%),linear-gradient(180deg,_#f8f3e8_0%,_#efe6d1_44%,_#e1d1b0_100%)] text-stone-900"
>
  <div class="absolute inset-0 opacity-40 pointer-events-none">
    <div class="absolute left-1/2 top-[12%] h-72 w-72 -translate-x-1/2 rounded-full bg-white/45 blur-3xl"></div>
    <div class="absolute -bottom-16 right-[-12%] h-72 w-72 rounded-full bg-amber-900/10 blur-3xl"></div>
  </div>

  <section class="relative flex h-full flex-col px-5 py-6 sm:px-8">
    <header class="mx-auto flex w-full max-w-md items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-stone-700/70">
      <p>Neck Counter</p>
      <p
        class="rounded-full px-3 py-1 transition-colors {canIncrement
          ? 'bg-emerald-800/10 text-emerald-800/70'
          : 'bg-amber-800/10 text-amber-800/70'}"
      >
        {canIncrement ? '● ready' : `◌ wait ${cooldownSeconds}s`}
      </p>
    </header>

    <div class="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6">
      <button
        class={incrementButtonClass}
        disabled={!canIncrement}
        on:click={increment}
        aria-label="Increase counter"
      >
        <div class="absolute inset-x-5 top-5 flex items-center justify-between text-[0.68rem] font-medium uppercase tracking-[0.24em] text-stone-600/70">
          <span>Tap</span>
          <span>+1</span>
        </div>

        <div class="text-center">
          <div class="font-['Avenir_Next','SF_Pro_Display','Segoe_UI',sans-serif] text-[5.5rem] font-semibold leading-none tracking-[-0.08em] text-stone-900 sm:text-[7rem]">
            {count}
          </div>
          <p class="mt-2 text-sm uppercase tracking-[0.35em] text-stone-700/55">
            reps
          </p>
        </div>
      </button>

      <div class="flex w-full max-w-[20rem] flex-row gap-3">
        <button
          class="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-stone-900/10 bg-stone-950 px-6 text-xs font-semibold uppercase tracking-[0.26em] text-stone-50 shadow-[0_18px_42px_rgba(28,25,23,0.2)] transition hover:bg-stone-900 active:scale-[0.97]"
          on:click={decrement}
          aria-label="Decrease counter"
        >
          decrease
        </button>
        <button
          class="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-red-900/10 bg-red-800 px-6 text-xs font-semibold uppercase tracking-[0.26em] text-stone-50 shadow-[0_18px_42px_rgba(153,27,27,0.2)] transition hover:bg-red-700 active:scale-[0.97]"
          on:click={reset}
          aria-label="Reset counter to zero"
        >
          reset
        </button>
      </div>
    </div>

    <footer class="mx-auto mt-auto pt-4 text-[0.6rem] uppercase tracking-[0.3em] text-stone-500/50">
      neck counter
    </footer>
  </section>
</main>
