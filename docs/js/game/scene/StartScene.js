class StartScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this._isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    this._createCloseButton();
    this.scale.on('resize', (gameSize) => {
      this._repositionCloseButton(gameSize.width);
    });
    if (this._isMobile) {
      this.input.once('pointerdown', () => this._enterFullscreenLandscape());
    }
  }
  _enterFullscreenLandscape() {
    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        try {
          screen.orientation.lock('landscape').catch(() => {});
        } catch (e) {}
      }
    }, { once: true });
    document.addEventListener('webkitfullscreenchange', () => {
      const fs = document.fullscreenElement || document.webkitFullscreenElement;
      if (fs) {
        try {
          screen.orientation.lock('landscape').catch(() => {});
        } catch (e) {}
      }
    }, { once: true });
    if (!this.scale.isFullscreen) {
      this.scale.startFullscreen();
    }
  }
  _createCloseButton() {
    const { width } = this.scale;
    this._btnR = 22;
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
      if (document.fullscreenElement) {
        document.exitFullscreen().finally(() => { window.location.href = 'index.html'; });
      } else {
        window.location.href = 'index.html';
      }
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