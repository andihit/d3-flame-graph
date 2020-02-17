import { select } from 'd3-selection'
import flamegraph from './flamegraph'
import './flamegraph.css'
import './template.css'

class FlameGraphUI {
    constructor (stacks, options) {
        this.stacks = stacks || { name: 'placeholder', value: 0, children: [] }
        this.options = options
    }

    init () {
        this.flameGraph = flamegraph()
            .selfValue(true)
            .minFrameSize(5)

        const details = document.getElementById('details')
        this.flameGraph.setDetailsElement(details)

        document.getElementById('search-btn').addEventListener('click', this.search.bind(this))
        document.getElementById('form').addEventListener('submit', (event) => {
            event.preventDefault()
            this.search()
        })
        document.getElementById('term').addEventListener('blur', this.search.bind(this))
        document.getElementById('reset-btn').addEventListener('click', this.resetZoom.bind(this))

        select('#chart')
            .datum(this.stacks)
            .call(this.flameGraph)
    }

    search () {
        const term = document.getElementById('term').value
        if (term === '') {
            this.flameGraph.clear()
        } else {
            this.flameGraph.search(term)
        }
    }

    resetZoom () {
        this.flameGraph.resetZoom()
    }
}

window.flamegraph = (stacks, options) => {
    const ui = new FlameGraphUI(stacks, options)
    ui.init()
}
