const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  /**
   * @inheritDoc
   */
  prompting() {
    this.props = {};

    return this.prompt([
      {
        type: 'confirm',
        name: 'generate',
        message: 'Do you want to generate the frontend boilerplate?',
        default: true,
      },
    ]).then((props) => {
      this.props.generate = props.generate;
    });
  }
  /**
   * @inheritDoc
   */
  writing() {
    const extensionPath = this.destinationPath(`extensions/${this.options.config.extension.organization}-${
      this.options.config.extension.name
    }/`);

    this.fs.copyTpl(
      `${extensionPath}extension-config.json`,
      `${extensionPath}extension-config.json`,
      {
        frontend: {
          enabled: Boolean(this.props.generate),
        },
      }
    );

    if (!this.props.generate) {
      this.fs.delete(`${extensionPath}frontend/**/*`);
      return;
    }

    this.fs.copyTpl(
      `${extensionPath}frontend/package.json`,
      `${extensionPath}frontend/package.json`,
      this.options.config
    );
  }
  /**
   * @inheritDoc
   */
  install() {
    if (!this.props.generate) {
      return;
    }

    process.chdir('./frontend/');

    this.spawnCommandSync('npm', ['i']);

    process.chdir('../');
  }
};
