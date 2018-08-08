class Spinner {
  constructor (text) {
    this.spinner = document.createElement('span')
    this.spinner.classList.add('spinner', 'text-secondary')
    this.spinner.innerText = '߷'
    this.spinner.title = text
    document.querySelector('.uploads').appendChild(this.spinner)
  }
  success () {
    this.spinner.classList.remove('spinner', 'text-secondary')
    this.spinner.innerText = '✓'
    this.spinner.classList.remove('fader', 'text-success')
    window.setTimeout(_ => this.spinner.remove(), 5000)
  }
  fail () {
    this.spinner.classList.remove('spinner', 'text-secondary')
    this.spinner.innerText = '✗'
    this.spinner.classList.add('fader', 'text-danger')
    window.setTimeout(_ => this.spinner.remove(), 5000)
  }
}
