<script lang="ts">
  import { tick } from 'svelte';
  import { slide, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Fa from 'svelte-fa';
  import {
    faComments,
    faXmark,
    faPaperPlane,
    faRobot,
    faUser,
    faSpinner
  } from '@fortawesome/free-solid-svg-icons';

  interface Message {
    role: 'user' | 'assistant';
    content: string;
    streaming?: boolean;
  }

  const SUGGESTIONS = [
    "Who is Divit?",
    "What projects has he built?",
    "What are his technical skills?",
    "Tell me about his experience",
    "How can I contact him?"
  ];

  let isOpen = false;
  let messages: Message[] = [];
  let inputValue = '';
  let isLoading = false;
  let messagesEl: HTMLElement;
  let inputEl: HTMLTextAreaElement;
  let hasError = false;

  function toggleOpen() {
    isOpen = !isOpen;
    if (isOpen && messages.length === 0) {
      // Show welcome on first open
    }
  }

  async function scrollToBottom() {
    await tick();
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  async function sendMessage(content: string) {
    const text = content.trim();
    if (!text || isLoading) return;

    hasError = false;
    inputValue = '';
    messages = [...messages, { role: 'user', content: text }];
    isLoading = true;

    const assistantMsg: Message = { role: 'assistant', content: '', streaming: true };
    messages = [...messages, assistantMsg];
    await scrollToBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send all messages except the empty streaming placeholder
          messages: messages.slice(0, -1).map(({ role, content }) => ({ role, content }))
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6);
          if (raw === '[DONE]') break;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              messages[messages.length - 1].content += parsed.text;
              messages = messages; // trigger reactivity
              await scrollToBottom();
            }
          } catch (e) {
            if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
              throw e;
            }
          }
        }
      }
    } catch (e) {
      hasError = true;
      messages[messages.length - 1].content =
        "Sorry, something went wrong. Please try again.";
      messages = messages;
    } finally {
      messages[messages.length - 1].streaming = false;
      messages = messages;
      isLoading = false;
      await scrollToBottom();
      inputEl?.focus();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  }

  function autoResize() {
    if (!inputEl) return;
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
  }

  $: if (!inputValue && inputEl) {
    inputEl.style.height = 'auto';
  }
</script>

<!-- Floating chat button -->
<button
  class="chat-toggle"
  class:open={isOpen}
  on:click={toggleOpen}
  aria-label={isOpen ? 'Close chat' : 'Chat with AI about Divit'}
>
  {#if isOpen}
    <Fa icon={faXmark} size="lg" />
  {:else}
    <Fa icon={faComments} size="lg" />
  {/if}
</button>

<!-- Chat panel -->
{#if isOpen}
  <div
    class="chat-panel"
    transition:slide={{ duration: 280, easing: quintOut, axis: 'y' }}
  >
    <!-- Header -->
    <div class="chat-header">
      <div class="header-info">
        <div class="avatar">
          <Fa icon={faRobot} />
        </div>
        <div>
          <span class="header-title">Ask about Divit</span>
          <span class="header-sub">AI-powered · RAG</span>
        </div>
      </div>
      <button class="close-btn" on:click={toggleOpen} aria-label="Close">
        <Fa icon={faXmark} />
      </button>
    </div>

    <!-- Messages -->
    <div class="messages" bind:this={messagesEl}>
      {#if messages.length === 0}
        <!-- Empty state with suggestions -->
        <div class="empty-state" transition:fade={{ duration: 200 }}>
          <p class="empty-hint">Ask me anything about Divit — his projects, skills, experience, or how to get in touch.</p>
          <div class="suggestions">
            {#each SUGGESTIONS as s}
              <button class="suggestion" on:click={() => sendMessage(s)}>{s}</button>
            {/each}
          </div>
        </div>
      {:else}
        {#each messages as msg, i (i)}
          <div class="message {msg.role}" class:streaming={msg.streaming}>
            <div class="msg-icon">
              <Fa icon={msg.role === 'user' ? faUser : faRobot} size="xs" />
            </div>
            <div class="msg-content">
              {#if msg.streaming && !msg.content}
                <span class="typing-dots">
                  <span></span><span></span><span></span>
                </span>
              {:else}
                {msg.content}
                {#if msg.streaming}
                  <span class="cursor-blink">▌</span>
                {/if}
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Input area -->
    <div class="input-area">
      <textarea
        bind:this={inputEl}
        bind:value={inputValue}
        on:keydown={handleKeydown}
        on:input={autoResize}
        placeholder="Ask something…"
        rows="1"
        disabled={isLoading}
      ></textarea>
      <button
        class="send-btn"
        on:click={() => sendMessage(inputValue)}
        disabled={isLoading || !inputValue.trim()}
        aria-label="Send"
      >
        {#if isLoading}
          <span class="spin"><Fa icon={faSpinner} /></span>
        {:else}
          <Fa icon={faPaperPlane} />
        {/if}
      </button>
    </div>
  </div>
{/if}

<style lang="scss">
  $accent: #ff0052;
  $bg-panel: #111111f2;
  $bg-header: #0d0d0d;
  $bg-input: #1a1a1a;
  $bg-user-msg: #1c0a10;
  $bg-ai-msg: #161616;
  $text: #ccc;
  $text-dim: #666;
  $border: #2a2a2a;
  $radius: 14px;

  .chat-toggle {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 1000;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    background: $accent;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba($accent, 0.4), 0 2px 8px rgba(0,0,0,0.5);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba($accent, 0.6), 0 2px 12px rgba(0,0,0,0.5);
    }

    &:active {
      transform: scale(0.95);
    }

    &.open {
      background: #333;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    }
  }

  .chat-panel {
    position: fixed;
    bottom: 92px;
    right: 28px;
    z-index: 999;
    width: 370px;
    max-height: 560px;
    border-radius: $radius;
    background: $bg-panel;
    border: 1px solid $border;
    box-shadow: 0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    backdrop-filter: blur(12px);

    @media (max-width: 505px) {
      width: calc(100vw - 24px);
      right: 12px;
      bottom: 88px;
      max-height: calc(100dvh - 120px);
    }
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: $bg-header;
    border-bottom: 1px solid $border;
    flex-shrink: 0;
  }

  .header-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, $accent, #7c3aed);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.8rem;
    flex-shrink: 0;
  }

  .header-title {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #e0e0e0;
    letter-spacing: 0.01em;
  }

  .header-sub {
    display: block;
    font-size: 0.68rem;
    color: $text-dim;
    margin-top: 1px;
  }

  .close-btn {
    background: none;
    border: none;
    color: $text-dim;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s, background 0.15s;

    &:hover {
      color: $text;
      background: #222;
    }
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 2px;
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .empty-hint {
    font-size: 0.78rem;
    color: $text-dim;
    line-height: 1.5;
    margin: 0;
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .suggestion {
    background: #1a1a1a;
    border: 1px solid $border;
    color: $text;
    font-size: 0.72rem;
    padding: 5px 10px;
    border-radius: 20px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    text-align: left;

    &:hover {
      border-color: $accent;
      color: #fff;
      background: rgba($accent, 0.08);
    }
  }

  .message {
    display: flex;
    gap: 8px;
    align-items: flex-start;

    &.user {
      flex-direction: row-reverse;

      .msg-icon {
        background: linear-gradient(135deg, $accent, #c0003e);
      }

      .msg-content {
        background: $bg-user-msg;
        border: 1px solid rgba($accent, 0.2);
        color: #e8e8e8;
        border-radius: 14px 4px 14px 14px;
      }
    }

    &.assistant {
      .msg-icon {
        background: linear-gradient(135deg, #7c3aed, #4f46e5);
      }

      .msg-content {
        background: $bg-ai-msg;
        border: 1px solid $border;
        color: $text;
        border-radius: 4px 14px 14px 14px;
      }
    }
  }

  .msg-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.65rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .msg-content {
    max-width: calc(100% - 36px);
    padding: 9px 12px;
    font-size: 0.8rem;
    line-height: 1.55;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .cursor-blink {
    display: inline-block;
    animation: blink 0.8s step-end infinite;
    color: $accent;
    margin-left: 1px;
    font-size: 0.85em;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .typing-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    height: 16px;

    span {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: $text-dim;
      animation: dot-bounce 1.2s ease-in-out infinite;

      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }

  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-4px); opacity: 1; }
  }

  .input-area {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    padding: 12px 14px;
    border-top: 1px solid $border;
    background: $bg-input;
    flex-shrink: 0;

    textarea {
      flex: 1;
      background: #111;
      border: 1px solid $border;
      border-radius: 10px;
      color: $text;
      font-size: 0.8rem;
      font-family: inherit;
      padding: 8px 12px;
      resize: none;
      outline: none;
      line-height: 1.5;
      min-height: 36px;
      max-height: 120px;
      transition: border-color 0.15s;

      &::placeholder {
        color: $text-dim;
      }

      &:focus {
        border-color: rgba($accent, 0.5);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: $accent;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, transform 0.1s, opacity 0.15s;
    font-size: 0.8rem;

    &:hover:not(:disabled) {
      background: lighten(#ff0052, 8%);
    }

    &:active:not(:disabled) {
      transform: scale(0.93);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  .spin {
    display: inline-flex;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
