class StartScene extends Phaser.Scene {
  #isMobile  = false;
  #tapText   = null;
  #btnBg     = null;
  #btnLabel  = null;
  #btnR      = 22;
  #btnMargin = 20;
  #btnX      = 0;
  #btnY      = 0;
  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.#isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    this.scale.on('resize', (gameSize) => {
      if (this.#tapText) this.#centerTapText(gameSize.width, gameSize.height);
      if (this.#btnBg)   this.#repositionCloseButton(gameSize.width);
    });
    this.#showTapToStart();
  }
  #showTapToStart() {
    const { width, height } = this.scale;
    const label = this.#isMobile ? 'TOCA PARA JUGAR' : 'CLICK PARA JUGAR';
    this.#tapText = this.add.text(0, 0, label, {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'courier, sans-serif',
      align: 'center'
    }).setOrigin(0.5).setDepth(5);
    this.#centerTapText(width, height);
    this.tweens.add({
      targets: this.#tapText,
      alpha: 0,
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    const trigger = () => {
      document.removeEventListener('touchend', trigger);
      document.removeEventListener('click', trigger);
      this.#enterFullscreen();
    };
    document.addEventListener('touchend', trigger);
    document.addEventListener('click', trigger);
  }
  #centerTapText(w, h) {
    this.#tapText.setPosition(w / 2, h / 2);
  }
  #enterFullscreen() {
    if (this.#tapText) {
      this.#tapText.destroy();
      this.#tapText = null;
    }
    const afterFullscreen = () => {
      if (this.#isMobile) {
        try {
          screen.orientation.lock('landscape').catch(() => {});
        } catch (e) {}
      }
      const createBtn = () => {
        if (!this.#btnBg) this.#createCloseButton();
      };
      this.sys.game.events.once('resume', createBtn);
      window.setTimeout(() => {
        this.sys.game.resume();
        createBtn();
      }, 300);
    };
    const el = document.documentElement;
    const requestFS = el.requestFullscreen
      || el.webkitRequestFullscreen
      || el.mozRequestFullScreen;
    if (requestFS) {
      requestFS.call(el)
        .then(() => afterFullscreen())
        .catch(() => afterFullscreen());
    } else {
      afterFullscreen();
    }
  }
  #createCloseButton() {
    const { width } = this.scale;
    this.#btnBg = this.add.graphics().setDepth(10);
    this.#btnLabel = this.add.text(0, 0, '✕', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
    this.#btnLabel.on('pointerover', () => this.#drawBtn(true));
    this.#btnLabel.on('pointerout',  () => this.#drawBtn(false));
    this.#btnLabel.on('pointerup',   () => {
      const exit = document.exitFullscreen
        ? document.exitFullscreen()
        : (document.webkitExitFullscreen ? Promise.resolve(document.webkitExitFullscreen()) : Promise.resolve());
      exit.finally(() => { window.location.href = 'index.html'; });
    });
    this.#repositionCloseButton(width);
  }
  #repositionCloseButton(w) {
    const cx = w - this.#btnMargin - this.#btnR;
    const cy = this.#btnMargin + this.#btnR;
    this.#btnX = cx;
    this.#btnY = cy;
    this.#drawBtn(false);
    this.#btnLabel.setPosition(cx, cy);
  }
  #drawBtn(hover) {
    this.#btnBg.clear();
    this.#btnBg.fillStyle(hover ? 0x555555 : 0x222222, 0.85);
    this.#btnBg.fillCircle(this.#btnX, this.#btnY, this.#btnR);
  }
}