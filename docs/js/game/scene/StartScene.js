class StartScene extends Phaser.Scene {
  create() {
    this.cameras.main.setBackgroundColor('#000000');
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
    if (isMobile) {
      this._lockLandscape();
    }
    this._createCloseButton();
    this.scale.on('resize', (gameSize) => {
      this._repositionCloseButton(gameSize.width);
    });
    if (isMobile) {
      this.time.delayedCall(300, () => {
        if (!this.scale.isFullscreen) {
          this.scale.startFullscreen();
        }
      });
    }
  }
  _lockLandscape() {
    try {
      screen.orientation.lock('landscape').catch(() => {});
    } catch (e) {}
  }
  _createCloseButton() {
    const { width } = this.scale;
    const r = 22;
    const margin = 20;
    this._btnBg = this.add.graphics().setDepth(10);
    this._btnLabel = this.add.text(0, 0, '✕', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
    this._btnLabel.on('pointerover', () => this._drawBtn(true));
    this._btnLabel.on('pointerout',  () => this._drawBtn(false));
    this._btnLabel.on('pointerup',   () => { window.location.href = 'index.html'; });
    this._btnR = r;
    this._btnMargin = margin;
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