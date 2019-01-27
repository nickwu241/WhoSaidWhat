var app = new Vue({
    el: '#app',
    data: {
        transcript: [],
        currentSpeaker: '',
        inputText: '',
        buttonDisabled: false
    },
    computed: {
        speakerClass() {
            return {
                'speaker': true,
                'mickey': this.currentSpeaker === 'MickeyMouse',
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
        },
        create() {
            console.log('enrolling', this.inputText)
            if (this.inputText === '') {
                return;
            }
            this.buttonDisabled = true;
            fetch(`/create/${this.inputText}`, {
                method: 'POST'
            })
                .then(r => r.json())
                .then(response => {
                    this.buttonDisabled = false;
                    var modal = document.getElementById('myModal');
                    modal.style.display = "none";
                });
        }
    },
    mounted() {
        var modal = document.getElementById('myModal');

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        var recBtn = document.getElementById("recordButton");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on the button, open the modal
        btn.onclick = function() {
            modal.style.display = "block";
        }

        recBtn.onclick = function() {
            recBtn.disabled = true;
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
        setInterval(this.getTranscript, 1000);
    }
})