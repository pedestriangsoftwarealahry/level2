document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const screens = {
        loading: document.getElementById('loading-screen'),
        conditions: document.getElementById('conditions-screen'),
        progress: document.getElementById('game-progress-screen'),
        ready: document.getElementById('ready-screen'),
        startLoading: document.getElementById('start-loading-screen'),
        gettingReady: document.getElementById('getting-ready-screen'),
        verifying: document.getElementById('verifying-screen'),
        task1: document.getElementById('task1-screen'),
        task2: document.getElementById('task2-screen'),
        task3: document.getElementById('task3-screen'),
        task4: document.getElementById('task4-screen'),
        task5: document.getElementById('task5-screen'),
        levelComplete: document.getElementById('level-complete-screen')
    };

    let currentScreenElement = screens.loading; // Start s úvodní obrazovkou

    // Elementy pro Conditions Screen
    const conditionsTitle = document.getElementById('conditions-title');
    const conditionTextsContainer = screens.conditions.querySelector('.text-block-container');
    const conditionTexts = Array.from(conditionTextsContainer.querySelectorAll('.dynamic-text'));
    const nextConditionBtn = document.getElementById('next-condition-btn');
    let currentConditionIndex = 0;

    // Elementy pro Game Progress Screen
    const progressTitle = document.getElementById('progress-title');
    const progressTextsContainer = screens.progress.querySelector('.text-block-container');
    const progressTexts = Array.from(progressTextsContainer.querySelectorAll('.dynamic-text'));
    const nextProgressBtn = document.getElementById('next-progress-btn');
    let currentProgressIndex = 0;

    // Elementy pro Ready Screen
    const readyTitle = document.getElementById('ready-title');
    const readyText = document.getElementById('ready-text');
    const startGameBtn = document.getElementById('start-game-btn');

    // Tlačítka pro ověření úkolů
    const verifyTask1Btn = document.getElementById('verify-task1-btn');
    const verifyTask2Btn = document.getElementById('verify-task2-btn');
    const verifyTask3Btn = document.getElementById('verify-task3-btn');
    const verifyTask4Btn = document.getElementById('verify-task4-btn');
    const verifyTask5Btn = document.getElementById('verify-task5-btn');
    const goNextLevelBtn = document.getElementById('go-next-level-btn');

    /**
     * Přepne aktivní obrazovku s plynulým posuvným efektem.
     * @param {HTMLElement} newScreenElement - Nová obrazovka, která se má aktivovat.
     * @param {Function} [callback] - Callback funkce, která se spustí po dokončení animace nové obrazovky.
     * @param {boolean} [instant=false] - Pokud je true, přepne okamžitě bez animace.
     */
    const setActiveScreen = (newScreenElement, callback = null, instant = false) => {
        if (currentScreenElement === newScreenElement) {
            if (callback) callback();
            return;
        }

        if (instant) {
            currentScreenElement.classList.remove('active');
            currentScreenElement.style.display = 'none';
            newScreenElement.style.display = 'flex';
            newScreenElement.classList.add('active');
            currentScreenElement = newScreenElement;
            if (callback) callback();
            return;
        }

        // Deaktivace staré obrazovky s posunem vlevo
        currentScreenElement.classList.remove('active');
        currentScreenElement.classList.add('slide-out-left');

        setTimeout(() => {
            currentScreenElement.style.display = 'none'; // Skrýt po animaci
            currentScreenElement.classList.remove('slide-out-left');

            // Aktivace nové obrazovky s posunem zprava
            currentScreenElement = newScreenElement;
            currentScreenElement.style.display = 'flex'; // Zobrazit před aktivací
            // Malá pauza, aby se aplikovaly počáteční styly před spuštěním animace
            requestAnimationFrame(() => {
                currentScreenElement.classList.add('active');
                if (callback) callback();
            });
        }, 500); // Délka slide-out-left animace
    };

    /**
     * Animuje přechod textů v rámci jednoho bloku.
     * @param {Array<HTMLElement>} texts - Pole textových elementů.
     * @param {number} currentIndex - Index aktuálně zobrazeného textu.
     * @param {Function} onFinish - Callback funkce, která se spustí po dokončení animace.
     */
    const animateTextTransition = (texts, currentIndex, onFinish) => {
        const currentText = texts[currentIndex];
        const nextText = texts[currentIndex + 1];

        currentText.classList.remove('current');
        currentText.classList.add('slide-out-left');

        setTimeout(() => {
            currentText.style.display = 'none';
            if (nextText) {
                nextText.style.display = 'block';
                nextText.classList.add('current');
                nextText.classList.remove('slide-out-right'); // Zajistí, že startuje zprava
                onFinish(false); // Ještě nejsme na konci
            } else {
                onFinish(true); // Jsme na konci textů
            }
        }, 500); // Doba animace textu
    };


    // --- PRŮBĚH HRY ---

    // 1. Úvodní načítací obrazovka
    setTimeout(() => {
        // Odsunutí textu "Načítám složku Level 2"
        document.getElementById('loading-text').classList.add('slide-out-left');
        setTimeout(() => {
            setActiveScreen(screens.conditions, () => {
                // Přijede nadpis a první text
                conditionsTitle.classList.remove('slide-out-left'); // Zajištění, že je na správné pozici pro slide-in
                nextConditionBtn.classList.remove('slide-out-left'); // Zajištění, že je na správné pozici pro slide-in
            }, true); // Okamžité přepnutí pro plynulý začátek
        }, 500); // Počkej na odsunití načítacího textu
    }, 20000); // 20 sekund pro úvodní načítání


    // 2. Navigace podmínkami hry
    nextConditionBtn.addEventListener('click', () => {
        animateTextTransition(conditionTexts, currentConditionIndex, (isFinished) => {
            if (isFinished) {
                // Odsunout i nadpis a tlačítko
                conditionsTitle.classList.add('slide-out-left');
                nextConditionBtn.classList.add('slide-out-left');
                setTimeout(() => {
                    setActiveScreen(screens.progress, () => {
                        // Přijede nadpis "Průběh hry" a první text
                        progressTitle.classList.remove('slide-out-left');
                        nextProgressBtn.classList.remove('slide-out-left');
                    });
                }, 500); // Počkej na odsunití nadpisu a tlačítka
            } else {
                currentConditionIndex++;
            }
        });
    });

    // 3. Navigace průběhem hry
    nextProgressBtn.addEventListener('click', () => {
        animateTextTransition(progressTexts, currentProgressIndex, (isFinished) => {
            if (isFinished) {
                // Odsunout i nadpis a tlačítko
                progressTitle.classList.add('slide-out-left');
                nextProgressBtn.classList.add('slide-out-left');
                setTimeout(() => {
                    setActiveScreen(screens.ready, () => {
                        // Přijede nadpis "Připravena?" a text
                        readyTitle.classList.remove('slide-out-left');
                        readyText.classList.remove('slide-out-left');
                        startGameBtn.classList.remove('slide-out-left');
                    });
                }, 500); // Počkej na odsunití nadpisu a tlačítka
            } else {
                currentProgressIndex++;
            }
        });
    });

    // 4. Spuštění hry z obrazovky "Připravena?"
    startGameBtn.addEventListener('click', () => {
        readyTitle.classList.add('slide-out-left');
        setTimeout(() => {
            readyText.classList.add('slide-out-left');
            setTimeout(() => {
                startGameBtn.classList.add('slide-out-left');
                setTimeout(() => {
                    setActiveScreen(screens.startLoading, () => {
                        // Kolečko se točí 10 sekund
                        setTimeout(() => {
                            // Obrazovka ztlumí a zhasne
                            gameContainer.classList.add('dimmed');
                            currentScreenElement.classList.remove('active'); // Odsune se aktivní obrazovka
                            setTimeout(() => {
                                setActiveScreen(screens.gettingReady, () => {
                                    // Obrazovka zesílí na "Getting Ready!"
                                    screens.gettingReady.classList.remove('black-screen'); // Odstraní black-screen, aby se uplatnil přechod na fade-in
                                    setTimeout(() => {
                                        // "Getting Ready!" se zobrazí na 5 sekund
                                        setActiveScreen(screens.task1);
                                    }, 5000);
                                });
                            }, 1000); // Doba zhasnutí
                        }, 10000); // Doba točení kolečka
                    }, true); // Okamžité přepnutí na loading screen
                }, 500); // Delay pro odsuniu tlačítka
            }, 500); // Delay pro odsuniu textu
        }, 500); // Delay pro odsuniu nadpisu
    });

    // 5. Ověřování odevzdání a přechod na další úkoly
    const showVerifyingScreen = (duration, nextTaskScreen) => {
        setActiveScreen(screens.verifying, () => {
            setTimeout(() => {
                setActiveScreen(nextTaskScreen);
            }, duration);
        });
    };

    verifyTask1Btn.addEventListener('click', () => showVerifyingScreen(15000, screens.task2));
    verifyTask2Btn.addEventListener('click', () => showVerifyingScreen(8000, screens.task3));
    verifyTask3Btn.addEventListener('click', () => showVerifyingScreen(51000, screens.task4));
    verifyTask4Btn.addEventListener('click', () => showVerifyingScreen(26000, screens.task5));
    verifyTask5Btn.addEventListener('click', () => showVerifyingScreen(23000, screens.levelComplete));

    // 6. Tlačítko pro přechod do dalšího levelu
    goNextLevelBtn.addEventListener('click', () => {
        window.location.href = 'https://pedestriangsoftwarealahry.github.io/level3/';
    });
});