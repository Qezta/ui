<script lang="ts">
  import { onMount } from 'svelte';
  import { executeCommand, type CommandResponse } from '../../lib/data/terminal-commands';

  interface HistoryEntry {
    input: string;
    output: string;
    isError: boolean;
  }

  let input = '';
  let history: HistoryEntry[] = [];
  let commandHistory: string[] = [];
  let historyIndex = -1;
  let terminalElement: HTMLDivElement;
  let inputElement: HTMLInputElement;
  let isVisible = false;

  onMount(() => {
    // Show welcome message
    history = [
      {
        input: '',
        output: `Welcome to Divit's Terminal! 🚀

Type 'help' to see available commands.
Type 'about' to learn more about me.

This is an interactive CLI experience - explore away!`,
        isError: false
      }
    ];
  });

  function handleSubmit() {
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    // Execute command
    const result: CommandResponse = executeCommand(trimmedInput);

    // Special handling for clear command
    if (result.output === '__CLEAR__') {
      history = [];
      input = '';
      return;
    }

    // Special handling for resume command
    if (trimmedInput === 'resume') {
      // Trigger CV download
      const link = document.createElement('a');
      link.href = '/cv/Divit_Mittal_CV.pdf';
      link.download = 'Divit_Mittal_CV.pdf';
      link.click();
    }

    // Add to history
    history = [
      ...history,
      {
        input: trimmedInput,
        output: result.output,
        isError: result.isError || false
      }
    ];

    // Add to command history
    commandHistory = [...commandHistory, trimmedInput];
    historyIndex = commandHistory.length;

    // Clear input
    input = '';

    // Scroll to bottom
    setTimeout(() => {
      if (terminalElement) {
        terminalElement.scrollTop = terminalElement.scrollHeight;
      }
    }, 0);
  }

  function handleKeyDown(e: KeyboardEvent) {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input = commandHistory[historyIndex];
      }
    }

    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input = '';
      }
    }

    // Tab - autocomplete (basic)
    if (e.key === 'Tab') {
      e.preventDefault();
      // Could add autocomplete logic here
    }
  }

  function focusInput() {
    inputElement?.focus();
  }

  function toggleTerminal() {
    isVisible = !isVisible;
    if (isVisible) {
      setTimeout(() => focusInput(), 100);
    }
  }
</script>

<!-- Terminal Toggle Button -->
<button class="terminal-toggle" on:click={toggleTerminal} aria-label="Toggle Terminal">
  <span class="terminal-icon">{isVisible ? '✕' : '▶_'}</span>
  <span class="terminal-label">Terminal</span>
</button>

<!-- Terminal Window -->
{#if isVisible}
  <div class="terminal-container">
    <div class="terminal-header">
      <div class="terminal-title">divit@terminal:~$</div>
      <button class="terminal-close" on:click={toggleTerminal} aria-label="Close Terminal">
        ✕
      </button>
    </div>

    <div
      class="terminal-content"
      bind:this={terminalElement}
      on:click={focusInput}
      role="log"
      aria-live="polite"
    >
      {#each history as entry}
        {#if entry.input}
          <div class="terminal-prompt">
            <span class="prompt-symbol">$</span>
            <span class="prompt-input">{entry.input}</span>
          </div>
        {/if}
        {#if entry.output}
          <pre class="terminal-output" class:error={entry.isError}>{entry.output}</pre>
        {/if}
      {/each}

      <!-- Current input line -->
      <div class="terminal-prompt">
        <span class="prompt-symbol">$</span>
        <input
          bind:this={inputElement}
          bind:value={input}
          on:keydown={handleKeyDown}
          on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
          class="terminal-input"
          type="text"
          spellcheck="false"
          autocomplete="off"
          aria-label="Terminal input"
        />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .terminal-toggle {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 999;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    &:active {
      transform: translateY(0);
    }

    .terminal-icon {
      font-size: 1.1rem;
    }

    .terminal-label {
      @media (max-width: 505px) {
        display: none;
      }
    }
  }

  .terminal-container {
    position: fixed;
    bottom: 5.5rem;
    right: 2rem;
    width: 650px;
    max-width: calc(100vw - 4rem);
    height: 500px;
    max-height: calc(100vh - 8rem);
    background: #1a1a1a;
    border: 2px solid #444;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    z-index: 998;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    animation: slideUp 0.3s ease;

    @media (max-width: 768px) {
      width: calc(100vw - 2rem);
      right: 1rem;
      bottom: 5rem;
      height: 450px;
      max-height: calc(100vh - 6rem);
    }

    @media (max-width: 505px) {
      width: calc(100vw - 1rem);
      right: 0.5rem;
      bottom: 4.5rem;
      height: 400px;
      max-height: calc(100vh - 5.5rem);
      border-radius: 4px;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.85rem 1.25rem;
    background: #0d0d0d;
    border-bottom: 1px solid #444;
    border-radius: 6px 6px 0 0;
  }

  .terminal-title {
    color: #00ff00;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .terminal-close {
    background: none;
    border: none;
    color: #888;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;

    &:hover {
      color: #ff0052;
    }
  }

  .terminal-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.25rem;
    color: #f0f0f0;
    font-size: 0.9rem;
    line-height: 1.6;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: #0d0d0d;
    }

    &::-webkit-scrollbar-thumb {
      background: #444;
      border-radius: 5px;

      &:hover {
        background: #555;
      }
    }
  }

  .terminal-prompt {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    align-items: flex-start;
  }

  .prompt-symbol {
    color: #00ff00;
    user-select: none;
    font-weight: 600;
    flex-shrink: 0;
  }

  .prompt-input {
    color: #fff;
    font-weight: 500;
  }

  .terminal-input {
    flex: 1;
    background: none;
    border: none;
    color: #fff;
    font-family: inherit;
    font-size: inherit;
    font-weight: 500;
    outline: none;
    caret-color: #00ff00;

    &::selection {
      background: #667eea;
    }
  }

  .terminal-output {
    margin: 0 0 1.25rem 0;
    padding-left: 2rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    color: #f5f5f5;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.6;

    &.error {
      color: #ff6b6b;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    .terminal-content {
      font-size: 0.85rem;
      padding: 1rem;
    }

    .terminal-output {
      padding-left: 1.5rem;
    }
  }

  @media (max-width: 505px) {
    .terminal-toggle {
      bottom: 1.5rem;
      right: 1.5rem;
      padding: 0.6rem 1.2rem;
      font-size: 0.85rem;
    }

    .terminal-content {
      padding: 1rem;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .terminal-output {
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }

    .terminal-prompt {
      margin-bottom: 0.6rem;
    }
  }
</style>
