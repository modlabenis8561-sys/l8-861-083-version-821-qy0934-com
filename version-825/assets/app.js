import { H as Hls } from "./hls-vendor.js";

const menuButton = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
  });
}

const hero = document.querySelector("[data-hero]");

if (hero) {
  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  let current = 0;

  const showSlide = (nextIndex) => {
    current = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === current);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === current);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  if (slides.length > 1) {
    window.setInterval(() => showSlide(current + 1), 5200);
  }
}

const initializePlayer = (panel) => {
  const video = panel.querySelector("[data-video]");
  const button = panel.querySelector("[data-play-button]");
  const source = panel.dataset.src;
  let hlsInstance = null;
  let sourceLoaded = false;

  const loadSource = () => {
    if (!video || !source || sourceLoaded) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      sourceLoaded = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      sourceLoaded = true;
    }
  };

  const playVideo = async () => {
    loadSource();
    if (!video) {
      return;
    }
    try {
      await video.play();
      if (button) {
        button.classList.add("is-hidden");
      }
    } catch (error) {
      if (button) {
        button.classList.remove("is-hidden");
        const label = button.querySelector("strong");
        if (label) {
          label.textContent = "点击播放";
        }
      }
    }
  };

  if (button) {
    button.addEventListener("click", playVideo);
  }

  if (video) {
    video.addEventListener("play", () => {
      if (button) {
        button.classList.add("is-hidden");
      }
    });
    video.addEventListener("pause", () => {
      if (button && video.currentTime === 0) {
        button.classList.remove("is-hidden");
      }
    });
    video.addEventListener("emptied", () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
        sourceLoaded = false;
      }
    });
  }
};

document.querySelectorAll("[data-player]").forEach(initializePlayer);

const bindHeaderSearch = () => {
  const forms = document.querySelectorAll(".header-search, .mobile-search");
  forms.forEach((form) => {
    form.addEventListener("submit", () => {
      const input = form.querySelector("input[name='q']");
      if (input) {
        input.value = input.value.trim();
      }
    });
  });
};

bindHeaderSearch();

const searchForm = document.querySelector("[data-search-form]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");
const searchStatus = document.querySelector("[data-search-status]");

const escapeHtml = (text) => String(text || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const renderSearchCard = (movie) => `
<article class="movie-card">
  <a class="poster-link" href="movie/movie-${String(movie.id).padStart(4, "0")}.html">
    <img src="${movie.cover}.jpg" alt="${escapeHtml(movie.title)}" loading="lazy">
    <span class="poster-year">${escapeHtml(movie.year)}</span>
    <span class="poster-type">${escapeHtml(movie.type)}</span>
  </a>
  <div class="movie-card-body">
    <h3><a href="movie/movie-${String(movie.id).padStart(4, "0")}.html">${escapeHtml(movie.title)}</a></h3>
    <p>${escapeHtml(movie.oneLine)}</p>
    <div class="card-meta">
      <span>${escapeHtml(movie.region)}</span>
      <span>${escapeHtml(movie.genre)}</span>
    </div>
  </div>
</article>`;

const runSearch = () => {
  if (!searchInput || !searchResults || !window.MOVIE_SEARCH_DATA) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();
  const data = window.MOVIE_SEARCH_DATA;
  const matched = query
    ? data.filter((movie) => movie.indexText.includes(query)).slice(0, 120)
    : data.slice(0, 36);

  searchResults.innerHTML = matched.map(renderSearchCard).join("");

  if (searchStatus) {
    searchStatus.textContent = query
      ? `找到 ${matched.length} 条与“${searchInput.value.trim()}”相关的影片`
      : "输入关键词即可搜索影片。";
  }
};

if (searchForm && searchInput) {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  searchInput.value = initialQuery;
  runSearch();

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);
    const query = searchInput.value.trim();
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
    runSearch();
  });

  searchInput.addEventListener("input", runSearch);
}
