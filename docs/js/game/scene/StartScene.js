class StartScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this._isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    this.scale.on('resize', (gameSize) => {
      if (this._tapText)  this._centerTapText(gameSize.width, gameSize.height);
      if (this._btnBg)    this._repositionCloseButton(gameSize.width);
    });
    this._showTapToStart();
  }
  _showTapToStart() {
    const { width, height } = this.scale;
    const label = this._isMobile ? 'TOCA PARA JUGAR' : 'CLICK PARA JUGAR';
    this._tapText = this.add.text(0, 0, label, {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'courier, sans-serif',
      align: 'center'
    }).setOrigin(0.5).setDepth(5);
    this._centerTapText(width, height);
    this.tweens.add({
      targets: this._tapText,
      alpha: 0,
      duration: 600,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
    const trigger = () => {
      document.removeEventListener('touchend', trigger);
      document.removeEventListener('click', trigger);
      this._enterFullscreen();
    };
    document.addEventListener('touchend', trigger);
    document.addEventListener('click', trigger);
  }
  _centerTapText(w, h) {
    this._tapText.setPosition(w / 2, h / 2);
  }
  _enterFullscreen() {
    if (this._tapText) {
      this._tapText.destroy();
      this._tapText = null;
    }
    const afterFullscreen = () => {
      if (this._isMobile) {
        try {
          screen.orientation.lock('landscape').catch(() => {});
        } catch (e) {}
      }
      const createBtn = () => {
        if (!this._btnBg) this._createCloseButton();
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
  _createCloseButton() {
    const { width } = this.scale;
    this._btnR      = 22;
    this._btnMargin = 20;
    this._btnBg = this.add.graphics().setDepth(10);
    this._btnLabel = this.add.text(0, 0, '✕', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
    this._btnLabel.on('pointerover', () => this._drawBtn(true));
    this._btnLabel.on('pointerout',  () => this._drawBtn(false));
    this._btnLabel.on('pointerup',   () => {
      const exit = document.exitFullscreen
        ? document.exitFullscreen()
        : (document.webkitExitFullscreen ? Promise.resolve(document.webkitExitFullscreen()) : Promise.resolve());
      exit.finally(() => { window.location.href = 'index.html'; });
    });
    this._repositionCloseButton(width);
  }
  _repositionCloseButton(w) {
    const cx = w - this._btnMargin - this._btnR;
    const cy = this._btnMargin + this._btnR;
    this._btnX = cx;
    this._btnY = cy;
    this._drawBtn(false);
    this._btnLabel.setPosition(cx, cy);
  }
  _drawBtn(hover) {
    this._btnBg.clear();
    this._btnBg.fillStyle(hover ? 0x555555 : 0x222222, 0.85);
    this._btnBg.fillCircle(this._btnX, this._btnY, this._btnR);
  }
}