"use strict";

const piscineGroup = {
  x: -50,
  y: 100,
  tag: "piscine",
  title: "Piscine",
  color: "#0ab8fd",
  darkColor: "#0ab8fd",
  lightColor: "#0284c7",
  desc: "A 4-week intensive bootcamp that serves as the entry point to the 42 program. It's a test of determination and a crash course in C programming.",
  nodes: {
    1: {
      nodes: [
        {
          title: ["Piscine"],
          tags: ["C", "Bash"],
          desc: "Intensive 4-week bootcamp covering C, algorithms, memory management and Unix fundamentals — the foundation of the 42 curriculum.",
          link: "https://github.com/Molasz/42Piscine",
        },
        {
          title: ["Piscine", "Reloaded"],
          tags: ["C"],
          desc: "Review of the Piscine with additional exercises, focusing on optimization and best practices — essential reinforcement before the projects.",
          link: "https://github.com/Molasz/42PiscineReloaded",
          fs: 8,
        },
        {
          title: ["BSQ"],
          tags: ["C", "Algorithms"],
          desc: "The classic 'Biggest Square' problem — find the largest square in a grid with obstacles, using dynamic programming and efficient file parsing.",
          link: "https://github.com/photocatalysta/42-Piscine-BSQ-Project",
        },
      ],
    },
  },
};

const commonGroup = {
  x: 320,
  y: 340,
  title: "Common core",
  desc: "The main curriculum at 42, covering a wide range of topics from basic algorithms to web development and computer graphics.",
  tag: "common",
  showNumbers: true,
  color: "#10ecd3",
  darkColor: "#10ecd3",
  lightColor: "#0d9488",
  nodes: {
    0: {
      x: 320,
      y: 340,
      r: 22,
      title: ["libft"],
      tags: ["Rank 0", "C"],
      group: "rank-0",
      desc: "Re-implement the C standard library from scratch — the backbone of every project that follows.",
      link: "https://github.com/Molasz/42cursus-libft",
    },
    1: {
      offset: 70,
      nodes: [
        {
          x: 389,
          y: 300,
          title: ["ft_printf"],
          tags: ["Rank 1", "C"],
          group: "rank-1",
          desc: "Re-implementation of printf using variadic functions — flags, width, precision and justification.",
          link: "https://github.com/Molasz/42cursus-ft_printf",
        },
        {
          x: 251,
          y: 380,
          title: ["GNL"],
          tags: ["Rank 1", "C"],
          group: "rank-1",
          desc: "Read any file descriptor one line at a time with a configurable BUFFER_SIZE.",
          link: "https://github.com/Molasz/42cursus-get_next_line",
        },
      ],
    },
    2: {
      nodes: [
        {
          x: 455,
          y: 340,
          title: ["push_swap"],
          fs: 9,
          tags: ["Rank 2", "C"],
          group: "rank-2",
          desc: "Sort a stack of integers using only two stacks and a minimum number of operations.",
          link: "https://github.com/Molasz/42cursus-push_swap",
        },
        {
          x: 253,
          y: 457,
          title: ["pipex"],
          tags: ["Rank 2", "C"],
          group: "rank-2",
          desc: "Recreate shell pipes using fork, execve and file descriptor redirection.",
          link: "https://github.com/Molasz/42cursus-pipex",
        },
        {
          x: 253,
          y: 223,
          title: ["FDF"],
          tags: ["Rank 2", "C", "3D"],
          group: "rank-2",
          desc: "3D wireframe terrain renderer — read elevation maps and project them in isometric 3D using MiniLibX.",
          link: "https://github.com/Molasz/42cursus-fdf",
        },
      ],
    },
    3: {
      nodes: [
        {
          x: 501,
          y: 399,
          title: ["philosophers"],
          fs: 8,
          tags: ["Rank 3", "C", "Threads"],
          group: "rank-3",
          desc: "The Dining Philosophers problem — threads, mutexes and deadlock prevention in C.",
          link: "https://github.com/Molasz/42cursus-philosophers",
        },
        {
          x: 139,
          y: 281,
          title: ["minishell"],
          tags: ["Rank 3", "C", "Bash"],
          group: "rank-3",
          desc: "A fully functional Unix shell with pipes, redirections, heredocs, variable expansion and all builtins.",
          link: "https://github.com/Molasz/42cursus-minishell",
        },
      ],
    },
    4: {
      nodes: [
        {
          x: 518,
          y: 196,
          title: ["cub3D"],
          tags: ["Rank 4", "C", "2D", "3D"],
          group: "rank-4",
          desc: "Raycasting engine inspired by Wolfenstein 3D — DDA algorithm, textures, minimap, built with MLX42.",
          link: "https://github.com/Molasz/42cursus-cub3d",
        },
      ],
    },
    5: {
      nodes: [
        {
          x: 360,
          y: 45,
          title: ["C++", "Modules"],
          tags: ["Rank 5", "C++"],
          group: "rank-5",
          desc: "10 modules covering C++98 OOP: Orthodox Canonical Form, polymorphism, templates, STL and exceptions.",
          link: "https://github.com/Molasz/42cursus-cpp_modules",
        },
        {
          x: 580,
          y: 490,
          title: ["Inception"],
          tags: ["Rank 5", "Docker", "Linux", "Web"],
          group: "rank-5",
          desc: "Docker infrastructure from scratch: NGINX + WordPress + MariaDB, persistent volumes, no pre-built images.",
          link: "https://github.com/Molasz/42cursus-inception",
        },
        {
          x: 60,
          y: 490,
          title: ["webserv"],
          tags: ["Rank 5", "C++"],
          group: "rank-5",
          desc: "HTTP/1.1 web server in C++ with config files, virtual hosts, CGI and non-blocking I/O.",
          link: "https://github.com/Molasz/42cursus-webserv",
        },
      ],
    },
    6: {
      offset: 100,
      nodes: [
        {
          x: 320,
          y: 685,
          r: 34,
          title: ["ft_transcendence"],
          fs: 7,
          tags: ["Rank 6", "Docker", "Django", "JS"],
          group: "rank-6",
          desc: "Final project — fullstack web app with Docker, Django backend and React frontend. A 42-themed social platform with real-time features.",
          link: "https://github.com/Molasz/42cursus-ft_transcendence",
        },
      ],
    },
  },
};

const toolsGroup = {
  x: 690,
  y: 100,
  tag: "tools",
  title: "Tools",
  desc: "Tools and utils that I use in my development workflow to enhance productivity and coding experience.",
  color: "#05d362",
  darkColor: "#05d362",
  lightColor: "#16a34a",

  nodes: {
    1: {
      nodes: [
        {
          title: [".vimrc"],
          tags: ["Vim", "Config"],
          desc: "My personalized .vimrc configuration — custom keybindings, plugins and settings to optimize my coding workflow in Vim.",
          link: "https://github.com/Molasz/vimrc",
        },
        {
          title: ["42-graph"],
          tags: ["JS", "CSS", "HTML"],
          desc: "This graph visualization of my 42 journey — built with vanilla JS and CSS, showcasing projects, skills and experiences in an interactive format.",
          link: "https://github.com/Molasz/42-graph",
          fs: 8,
        },
      ],
    },
  },
};

const workGroups = {
  x: -50,
  y: 580,
  title: "Work Experience",
  desc: "Projects and experiences from my professional career, showcasing real-world applications of the skills learned at 42 and beyond.",
  tag: "work",
  color: "#569661",
  darkColor: "#569661",
  lightColor: "#166534",
  nodes: {
    1: {
      nodes: [
        {
          title: ["CV"],
          desc: "Download my CV — experience & technical skills overview",
          link: "assets/CV.pdf",
        },
        {
          title: ["Work", "Experience I"],
          fs: 8,
          desc: "Fullstack Tech Lead · 1 year · Led a team of 7 developers on an Angular + .NET application, owning architecture design, feature implementation, and code quality standards.",
        },
      ],
    },
  },
};

const outerGroups = {
  x: 690,
  y: 580,
  title: "Outer Projects",
  desc: "Personal projects outside of the 42 curriculum, exploring various technologies and programming paradigms for fun and learning.",
  tag: "outer",
  color: "#8ceb10",
  darkColor: "#8ceb10",
  lightColor: "#65a30d",
  nodes: {
    2: {
      offset: -120,
      nodes: [
        {
          title: ["libasm"],
          tags: ["Outer", "ASM", "C"],
          desc: "Re-implement core C functions in x86-64 assembly — ft_strlen, ft_strcpy, ft_strcmp, ft_write, ft_read, ft_strdup. Learn low-Rank programming and calling conventions.",
          link: "https://github.com/Molasz/42outer-libasm",
        },
        {
          title: ["dr-quine"],
          tags: ["Outer", "ASM", "C", "JS"],
          desc: "Create self-replicating programs (quines) in C, asm and JS — programs that output their own source code. Explore code generation and self-reference.",
          link: "https://github.com/Molasz/42outer-dr-quine",
        },
        {
          title: ["nm"],
          tags: ["Outer", "C", "BASH"],
          desc: "Re-implement the nm command — display symbol table of object files. Parse ELF format, handle symbols, types and values.",
          link: "https://github.com/Molasz/42outer-nm",
        },
        {
          title: ["malloc"],
          tags: ["Outer", "C", "BASH"],
          desc: "Re-implement malloc, free and realloc — create a custom memory allocator in C. Manage memory blocks, handle fragmentation and optimize for performance.",
          link: "https://github.com/Molasz/42outer-malloc",
        },
        {
          title: ["ls"],
          tags: ["Outer", "C", "BASH"],
          desc: "Re-implement the ls command — list directory contents. Handle file attributes, sorting and display options.",
          link: "https://github.com/Molasz/42outer-ls",
          inProgress: true,
        },
      ],
    },
  },
};

export const groups = [
  piscineGroup,
  commonGroup,
  toolsGroup,
  workGroups,
  outerGroups,
];
