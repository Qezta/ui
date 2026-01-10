export interface CommandResponse {
  output: string;
  isError?: boolean;
}

export interface CommandDefinition {
  description: string;
  execute: (args: string[]) => CommandResponse;
}

const projects = [
  {
    name: 'HybridTransformer-MFIF',
    category: 'ml',
    stars: '*',
    desc: 'Funded computer vision research'
  },
  {
    name: 'OS-nixCfg',
    category: 'infrastructure',
    stars: '*** 14',
    desc: 'DRW-recognized Nix configuration'
  },
  {
    name: 'hs-faust',
    category: 'functional',
    stars: '* 5',
    desc: 'Haskell DSL for audio processing'
  },
  {
    name: 'CARLA-Autonomous-Driving',
    category: 'ml',
    stars: '*** 18',
    desc: '5th place national hackathon'
  },
  { name: 'DocAssist-LLM', category: 'ml', stars: '* 8', desc: 'RAG-enhanced LLM from scratch' },
  {
    name: 'kanata-service',
    category: 'infrastructure',
    stars: '* 11',
    desc: 'macOS launchctl service manager'
  }
];

const skills = {
  'Functional Programming': ['Haskell', 'Nix', 'FFI', 'DSL Design', 'Type Systems'],
  Infrastructure: ['NixOS', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
  'AI/ML': ['PyTorch', 'Transformers', 'Computer Vision', 'RAG', 'HuggingFace'],
  'Data Engineering': ['Spark', 'AWS Glue', 'Hadoop', 'Kafka', 'PowerBI'],
  DevOps: ['GitHub Actions', 'Jenkins', 'Hydra', 'Nix Binary Caching'],
  Languages: ['Python', 'TypeScript', 'Haskell', 'Go', 'Swift', 'Bash']
};

export const commands: Record<string, CommandDefinition> = {
  help: {
    description: 'Show available commands',
    execute: () => ({
      output: `Available commands:

  help              Show this help message
  about             Display information about Divit
  projects          List all projects
  projects --ml     Filter projects by category (ml|infrastructure|functional)
  skills            Show technical expertise
  skills --expert   Show only expert-level skills
  contact           Display contact information
  experience        Show work experience
  resume            View CV
  clear             Clear terminal
  nix-build         Build profile (Easter egg)
  sudo rm -rf /     Don't even try this
  cowsay <text>     Make the cow say something

Type any command to get started!`
    })
  },

  about: {
    description: 'Display information about Divit',
    execute: () => ({
      output: `Divit Mittal - Infrastructure Engineer & ML Researcher

B.Tech Data Science @ Manipal University Jaipur (8.0 CGPA)
Nix Ecosystem Consultant @ Tweag (Blockfrost, ModusCreate)
Published Research: HuggingFace + Kaggle
BobbleAI Datathon Winner, DRW Recognition

Specializing in:
• Functional Programming (Haskell, Nix)
• Infrastructure as Code (NixOS, 100+ modules)
• Computer Vision Transformers (Funded Research)
• Cloud Data Engineering (AWS, Spark)

A rare intersection of functional programming, infrastructure engineering,
and AI/ML research with production consulting experience.`
    })
  },

  projects: {
    description: 'List projects',
    execute: (args) => {
      const filter = args[0]?.replace('--', '');
      let filtered = projects;

      if (filter && ['ml', 'infrastructure', 'functional'].includes(filter)) {
        filtered = projects.filter((p) => p.category === filter);
      }

      if (filtered.length === 0) {
        return {
          output: `No projects found for category: ${filter}
Valid categories: ml, infrastructure, functional`,
          isError: true
        };
      }

      const output = filtered
        .map((p) => `${p.stars.padEnd(12)} ${p.name.padEnd(30)} ${p.desc}`)
        .join('\n');

      return {
        output: `Projects ${filter ? `(${filter})` : ''}:\n\n${output}\n\nTip: Try 'projects --ml' or 'projects --infrastructure'`
      };
    }
  },

  skills: {
    description: 'Show technical expertise',
    execute: (args) => {
      const showExpertOnly = args.includes('--expert');

      if (showExpertOnly) {
        return {
          output: `Expert-Level Skills:

Functional Programming & Type Systems
  • Haskell (FFI, Cabal, type-safe DSL design)
  • Nix (Advanced derivations, flakes, overlays)
  • Type Systems, Pure Functions, Immutability

Infrastructure & System Administration
  • NixOS (100+ modules, 4+ platforms)
  • Linux/macOS SysAdmin (systemd, launchd)
  • Infrastructure as Code (Declarative configs)
  • CI/CD Automation (Hydra, GitHub Actions)

Level: ███████████░░░ Expert`
        };
      }

      const output = Object.entries(skills)
        .map(([category, items]) => `${category}:\n  • ${items.join('\n  • ')}`)
        .join('\n\n');

      return {
        output: `Technical Skills:\n\n${output}\n\nTip: Try 'skills --expert' for expert-level skills only`
      };
    }
  },

  contact: {
    description: 'Display contact information',
    execute: () => ({
      output: `Contact Information:

Email:        divitmittal@outlook.in
GitHub:       github.com/DivitMittal
LinkedIn:     linkedin.com/in/divit-mittal
HuggingFace:  huggingface.co/divitmittal
Kaggle:       kaggle.com/divitmittal
Twitter:      x.com/Divit_Mittal

Feel free to reach out!`
    })
  },

  experience: {
    description: 'Show work experience',
    execute: () => ({
      output: `Work Experience:

Nix Ecosystem Consultant @ Tweag (July 2024 - Present)
   • Blockfrost Cardano Node Integration
   • ModusCreate CI/CD Infrastructure Automation
   • Enterprise-scale configuration management

Computer Vision Researcher @ Manipal University (May-Aug 2025)
   • Funded research on Hybrid Transformer MFIF
   • Published model on HuggingFace with live demo
   • State-of-the-art results on benchmark datasets

DevOps & SysAdmin @ UbiOps, Yes!Delft (Dec 2021 - Feb 2022)
   • Containerized ML workloads (Docker/Kubernetes)
   • CI/CD pipelines, AWS/GCP infrastructure

Awards:
   • BobbleAI Datathon Winner (Sept 2024)
   • Proglint CV2k23 5th Place (Oct 2023)`
    })
  },

  resume: {
    description: 'View CV',
    execute: () => {
      // This will be handled by the component to open Europass link
      return {
        output: `Opening Europass CV...

Your CV is opening in a new tab!`
      };
    }
  },

  clear: {
    description: 'Clear terminal',
    execute: () => ({ output: '__CLEAR__' })
  },

  'nix-build': {
    description: 'Build profile',
    execute: () => ({
      output: `these 42 derivations will be built:
  /nix/store/...-divit-profile-0.1.0.drv
  /nix/store/...-expertise-ml-research.drv
  /nix/store/...-expertise-nix-infrastructure.drv
  /nix/store/...-expertise-functional-programming.drv

building '/nix/store/...-divit-profile-0.1.0.drv'...
unpacking sources
patching sources
configuring
building
  [1/42] Compiling Haskell skills... OK
  [2/42] Building Nix expertise... OK
  [3/42] Training ML models... OK
  [4/42] Optimizing infrastructure... OK
  ...
  [42/42] Final assembly... OK

build time: 0.5s
output: /nix/store/...-divit-profile-0.1.0

Success! Profile built successfully.`
    })
  },

  'sudo rm -rf /': {
    description: 'DO NOT RUN THIS',
    execute: () => ({
      output: `Nice try!

But this is a web terminal, not a real shell.
Your system is safe... for now.

Fun fact: On NixOS, even if you did run this, the system could
be rebuilt from configuration. That's the power of declarative
infrastructure!`
    })
  },

  cowsay: {
    description: 'Make the cow say something',
    execute: (args) => {
      const text = args.join(' ') || 'Hello from Divit!';
      const line = '_'.repeat(text.length + 2);

      return {
        output: ` ${line}
< ${text} >
 ${line}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`
      };
    }
  }
};

export function executeCommand(input: string): CommandResponse {
  const [cmd, ...args] = input.trim().split(/\s+/);

  if (!cmd) {
    return { output: '' };
  }

  const command = commands[cmd];

  if (!command) {
    return {
      output: `Command not found: ${cmd}
Type 'help' for available commands.`,
      isError: true
    };
  }

  return command.execute(args);
}
