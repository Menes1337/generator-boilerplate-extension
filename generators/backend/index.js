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
        message: 'Do you want to generate the backend boilerplate?',
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

    if (!this.props.generate) {
      this.fs.delete(`${extensionPath}extension/**/*`);
      this.fs.delete(`${extensionPath}pipelines/**/*`);
      this.fs.delete(`${extensionPath}extension/.*`);
      return;
    }

    this.fs.copyTpl(
      `${extensionPath}extension/package.json`,
      `${extensionPath}extension/package.json`,
      this.options.config
    );

    this.fs.copyTpl(
      `${extensionPath}pipelines/awesomeOrganization.awesomePipeline.v1.json`,
      `${extensionPath
      }pipelines/${
        this.options.config.extension.organization
      }.awesomePipeline.json`,
      this.options.config
    );
    this.fs.delete(`${extensionPath}pipelines/awesomeOrganization.awesomePipeline.v1.json`);
  }

  /**
   * @inheritDoc
   */
  install() {
    if (!this.props.generate) {
      return;
    }

    process.chdir('./extension/');

    this.spawnCommandSync('npm', ['i']);

    process.chdir('../');
  }
};
