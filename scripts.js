Reveal.initialize({
    controls: true,
    progress: true,
    hash: true,
    width: "1280",
    height: "800",
    showNotes: true,

    //view: 'scroll',
    //scrollProgress: true,

    menu: {
        themes: false,
        transitions: false,
        markers: true,
        hideMissingTitles: false,
        custom: [
            {
                title: 'Thumbs',
                icon: '<i class="fa fa-external-link">',
                src: 'thumbs.htm'
            },
            {
                title: 'About',
                icon: '<i class="fa fa-info">',
                content: '<p>This slidedeck is created with reveal.js</p>'
            },
        ],
    },

    customcontrols: {
        controls: [
            {
                id: 'toggle-overview',
                title: 'Toggle overview (O)',
                icon: '<i class="fa fa-th"></i>',
                action: 'Reveal.toggleOverview();',
            },
            {
                id: 'toggle-scroll-view',
                title: 'Toggle Scroll View (1)',
                icon: '<i class="fa fa-file"></i>',
                action: 'Reveal.toggleScrollView();',
            },
        ]
    },

    // simplemenu: {
    //     barhtml: {
    //         header: "<div class='menubar'><ul class='menu'></ul><div>",
    //         footer: ""
    //     }
    // },

    audio: {
        prefix: 'audio/', 	// audio files are stored in the "audio" folder
        suffix: '.m4a',  	// audio files have the ".webm" ending
        textToSpeechURL: null,  // the URL to the text to speech converter
        defaultNotes: false, 	// use slide notes as default for the text to speech converter
        defaultText: false, 	// use slide text as default for the text to speech converter
        advance: 0, 		// advance to next slide after given time in milliseconds after audio has played, use negative value to not advance
        autoplay: false,	// automatically start slideshow
        defaultDuration: 5,	// default duration in seconds if no audio is available
        defaultAudios: true,	// try to play audios with names such as audio/1.2.webm
        defaultPlaybackRate: 1.0, // speed of audio
        playerOpacity: 1,	// opacity value of audio player if unfocused
        playerStyle: 'position: fixed; bottom: 4px; left: 25%; width: 30%; height:75px; z-index: 33;', // style used for container of audio controls
        startAtFragment: false, // when moving to a slide, start at the current fragment or at the start of the slide
    },

    plugins: [
        RevealZoom,
        RevealNotes,
        RevealSearch,
        RevealMarkdown,
        RevealHighlight,
        RevealMenu,
        RevealCustomControls,
        Simplemenu,
        RevealAudioSlideshow,
        //RevealAudioRecorder,
    ]
});

// Select the node that will be observed for mutations
const targetNode = document.getElementById("rootReveal");

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        mutation.addedNodes.forEach(item => {
            if (item.id && item.id.startsWith("audio")){
                item.addEventListener('timeupdate', event => {
                    //console.debug( "timeupdate ");
                    
                    let media = event.target;
                    let now = media.currentTime;
                    let speakerNotes = document.getElementsByClassName("speaker-notes")[0];
                    let lines = speakerNotes.querySelectorAll('span[data-type="narration"]');

                    // highlight text as audio plays
                    for (var i = 0, l = lines.length; i < l; i++) {
                        let start = Number(lines[i].getAttribute("data-start"));
                        let end = Number(lines[i].getAttribute("data-end"));
                        let dataSection = lines[i].getAttribute("data-section");

                        if (now >= start &&
                            now <= end)
                        {
                            lines[i].classList.add("current");
                            if (i===0) {
                                Reveal.navigateFragment(-1);
                            }else{
                                Reveal.navigateFragment(i-1);
                            }
                        } else {
                            lines[i].classList.remove("current");
                        }
                    }
                })
            }
        })
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

Reveal.addEventListener( 'fragmentshown', function( event ) {
    //if ( timer ) { clearTimeout( timer ); timer = null; }
    console.debug( "fragmentshown ");
    //selectAudio();
} );

Reveal.addEventListener( 'fragmenthidden', function( event ) {
    //if ( timer ) { clearTimeout( timer ); timer = null; }
    console.debug( "fragmenthidden ");
    //selectAudio();
} );