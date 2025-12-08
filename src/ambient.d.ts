declare module '@qezta/ui/components/atoms/Cursor.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Cursor extends SvelteComponentTyped<{}, {}, {}> {}
}

declare module '@qezta/ui/components/atoms/Image.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Image extends SvelteComponentTyped<
    {
      src?: string;
      alt?: string;
      width?: string;
      height?: string;
      borderRadius?: string;
    },
    {},
    {}
  > {}
}

declare module '@qezta/ui/components/atoms/Title.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Title extends SvelteComponentTyped<{}, {}, {}> {}
}

declare module '@qezta/ui/components/atoms/Social.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Social extends SvelteComponentTyped<
    {
      icon: any;
      link: string;
    },
    {},
    {}
  > {}
}

declare module '@qezta/ui/components/atoms/SectionHeader.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class SectionHeader extends SvelteComponentTyped<{}, {}, { default: {} }> {}
}

declare module '@qezta/ui/components/molecules/About.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class About extends SvelteComponentTyped<{}, {}, {}> {}
}

declare module '@qezta/ui/components/molecules/Socials.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Socials extends SvelteComponentTyped<{}, {}, {}> {}
}

declare module '@qezta/ui/components/organisms/Card.svelte' {
  import type { SvelteComponentTyped } from 'svelte';
  export default class Card extends SvelteComponentTyped<{}, {}, {}> {}
}

declare module '@qezta/ui/cursor' {
  import type { Writable } from 'svelte/store';

  export interface CursorStore extends Writable<number> {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
  }

  export const burst: CursorStore;
  export const scale: Writable<number>;
}

declare module '@qezta/ui/styles/global.scss' {
  const content: string;
  export default content;
}

declare module '@qezta/ui/styles/fonts.scss' {
  const content: string;
  export default content;
}
