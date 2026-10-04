<!-- HEADER SECTION -->
<div align="center">

# SH-WEB-SWITCH

**[DEPRECATED] An early web application for remote project toggles and access management.**

<!-- BADGES -->
[![Status](https://img.shields.io/badge/Status-Deprecated-inactive?style=flat-square)](#)
[![Author](https://img.shields.io/badge/Author-Shawkat%20Hossain%20Maruf-black?style=flat-square)](https://shawkath646.dev)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-clouburstlab-2563EB?style=flat-square)](https://clouburstlab.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#-license)
[![Platform](https://img.shields.io/badge/Platform-Next.js%2013-black?style=flat-square&logo=next.js&logoColor=white)](#)

</div>

---

### 📋 Project Overview

| Property | Details |
| :--- | :--- |
| **Author** | [Shawkat Hossain Maruf](https://shawkath646.dev) |
| **Platform** | Full-Stack Web (Next.js 13, Firebase Firestore) |
| **Period / Timeline** | Oct 2023 – Nov 2023 |
| **Status** | Deprecated / Unmaintained (Archived) |
| **Evolution** | Evolved into [`NPM-shas-app-controller`](https://github.com/shawkath646/NPM-shas-app-controller) |
| **Primary Stack** | Next.js 13, TypeScript, Tailwind CSS, NextAuth, Firestore |

---

> [!WARNING]
> **Deprecation Notice**  
> This repository is **deprecated, unmaintained, and archived**. It served as an initial prototype for remotely toggling and managing project availability. The concept subsequently evolved into the [`NPM-shas-app-controller`](https://github.com/shawkath646/NPM-shas-app-controller) module. Both projects are now legacy and preserved solely for historical and architectural reference.

---

## 🎯 Purpose & History

### Why It Existed
When deploying experimental client projects and utility sites, developers often need the capability to remotely enable, disable, or restrict project access without redeploying code. SH-WEB-SWITCH provided a centralized web dashboard to toggle application state flags stored in cloud Firestore.

### What It Achieved
- **Remote Project Kill-Switch:** Instantly toggled live project availability flags across connected web applications.
- **TypeScript Integration:** Marked the first structured integration of strict TypeScript typing into personal application development.
- **Client & Server Gatekeeping:** Enforced access controls on both Next.js edge middleware and client-side page shells.

---

## 💡 Key Architectural Insights

- **Evolutionary Step:** The web dashboard approach proved cumbersome for distributed web projects, which motivated the evolution into the npm package [`NPM-shas-app-controller`](https://github.com/shawkath646/NPM-shas-app-controller).
- **Data Persistence:** Stored project state dictionaries inside Google Cloud Firestore.
- **Authentication:** Early authentication using NextAuth.js with guest preview modes.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth
- **Database:** Firebase Firestore

---

## 📄 License

Distributed under the [MIT License](LICENSE). See `LICENSE` for more information.

---

<!-- BRANDING FOOTER -->
<div align="center">
  <sub>Engineered by</sub><br/>
  <strong><a href="https://shawkath646.dev">Shawkat Hossain Maruf</a></strong>
  <br/><br/>
  <sub>A product of</sub><br/>
  <a href="https://clouburstlab.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://assets.clouburstlab.com/branding/icon_dark.png">
      <source media="(prefers-color-scheme: light)" srcset="https://assets.clouburstlab.com/branding/icon_light.png">
      <img alt="clouburstlab" src="https://assets.clouburstlab.com/branding/icon_light.png" width="230">
    </picture>
  </a>
</div>
