var app = new Vue({
    el: '#app',
    data: {
        transcript: [],
        currentSpeaker: '',
    },
    computed: {
        speakerClass() {
            return {
                'speaker': true,
                'mickey': this.currentSpeaker === 'Mickey',
                'jimmy': this.currentSpeaker === 'Jimmy',
                'sorina': this.currentSpeaker === 'Sorina'
            }
        },
        speechClass() {
            return {
                'speech': true,
            }

        }
    },
    methods: {
        getTranscript() {
            fetch('/transcript').then(r => r.json()).then(res => {
                this.transcript = res['transcript'];
                this.currentSpeaker = res['currentSpeaker'];
            }).catch(err => console.error(err));
        },
        export() {
            fetch('/export', {
                method: 'POST'
            })
        }
    },
    mounted() {
        setInterval(this.getTranscript, 1000);
    }
})