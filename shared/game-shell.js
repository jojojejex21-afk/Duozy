/**
 * DUOZY GAME SHELL
 * -----------------------------------------------------------------------------
 * Dipakai bersama oleh semua halaman game (games/*.html). Tugasnya:
 *   1. Mengontrol layar loading (#dz-loader) sampai game menyatakan siap.
 *   2. Menampilkan panel "koneksi lambat" bila game tak kunjung siap.
 *   3. Menangkap error JS supaya pemain melihat pesan yang jelas, bukan layar
 *      kosong — dan game yang error TIDAK mengganggu aplikasi Duozy utama.
 *   4. Menyediakan jalan pulang ke Duozy (back) dan toast singkat.
 *
 * Cara pakai di halaman game:
 *   <div id="dz-loader" class="dz-loader" data-title="Ludo" data-emoji="🎲"> ... </div>
 *   <script src="../shared/game-shell.js"></script>
 *   ... lalu setelah game selesai disiapkan panggil: DuozyGame.ready();
 */
(function () {
  'use strict';

  var SLOW_MS = 10000; // batas menunggu sebelum dianggap lambat
  var HOME_URL = '../index.html';

  var loader = null;
  var isReady = false;
  var slowTimer = null;

  function loaderEl() {
    if (!loader) loader = document.getElementById('dz-loader');
    return loader;
  }

  function q(selector) { var l = loaderEl(); return l ? l.querySelector(selector) : null; }

  /**
   * Menampilkan kondisi bermasalah pada layar loading.
   * @param {string} message - pesan untuk pemain
   */
  function showProblem(message) {
    var l = loaderEl();
    if (!l) return;
    l.style.display = '';
    l.classList.remove('dz-hide');
    l.classList.add('dz-problem');
    var msg = q('.dz-loader__msg');
    if (msg) msg.textContent = message;
  }

  /** Toast singkat di bawah layar (non-blocking). */
  function toast(text) {
    var old = document.querySelector('.dz-toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'dz-toast';
    el.textContent = text;
    document.body.appendChild(el);
    window.setTimeout(function () { el.remove(); }, 3200);
  }

  var DuozyGame = {
    /** Dipanggil game saat sudah siap dimainkan: layar loading memudar lalu dihapus. */
    ready: function () {
      isReady = true;
      window.clearTimeout(slowTimer);
      var l = loaderEl();
      if (!l) return;
      l.classList.add('dz-hide');
      window.setTimeout(function () { if (l) l.style.display = 'none'; }, 350);
    },

    /** Kembali ke Duozy: pakai riwayat browser bila datang dari Duozy (lebih cepat). */
    back: function () {
      var cameFromDuozy = document.referrer && document.referrer.indexOf(location.origin) === 0;
      if (cameFromDuozy && window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = HOME_URL;
      }
    },

    reload: function () { window.location.reload(); },
    toast: toast,
    fail: function (message) { showProblem(message || 'Terjadi kesalahan saat membuka game.'); }
  };

  function init() {
    loader = document.getElementById('dz-loader');
    if (loader) {
      var title = loader.getAttribute('data-title') || 'Game';
      var emoji = loader.getAttribute('data-emoji') || '🎮';
      var emojiEl = q('.dz-loader__emoji');
      var titleEl = q('.dz-loader__title');
      if (emojiEl) emojiEl.textContent = emoji;
      if (titleEl) titleEl.textContent = 'Membuka ' + title + '...';

      loader.addEventListener('click', function (event) {
        var action = event.target && event.target.getAttribute('data-dz');
        if (action === 'retry') DuozyGame.reload();
        if (action === 'back') DuozyGame.back();
      });

      slowTimer = window.setTimeout(function () {
        if (!isReady) showProblem('Koneksi lambat, game belum bisa dibuka. Coba lagi atau kembali ke Duozy.');
      }, SLOW_MS);
    }
  }

  // Elemen #dz-loader wajib berada di HTML sebelum tag <script src="game-shell.js">,
  // jadi DOM-nya sudah pasti tersedia begitu baris ini dieksekusi -> tidak perlu
  // menunggu DOMContentLoaded (menunggu itu justru menyebabkan race condition kalau
  // game memanggil DuozyGame.ready() secara sinkron tepat setelah script ini).
  init();

  // Error sebelum game siap -> panel masalah. Sesudah siap -> cukup toast (jangan menutup game).
  window.addEventListener('error', function (event) {
    if (window.console) console.error('[Game error]', event.message);
    if (!isReady) showProblem('Game gagal dimuat. Coba lagi, atau kembali ke Duozy.');
    else toast('Terjadi kesalahan kecil di game.');
  });
  window.addEventListener('unhandledrejection', function (event) {
    if (window.console) console.error('[Game promise error]', event.reason);
    if (!isReady) showProblem('Game gagal dimuat. Coba lagi, atau kembali ke Duozy.');
  });

  window.DuozyGame = DuozyGame;
})();
