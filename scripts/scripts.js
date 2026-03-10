const cube = document.getElementById('cube');
const faces = document.querySelectorAll('.face');
const backButton = document.getElementById('backButton');
const faceOpenSound = new Audio('resource/slow-swing.mp3');
faceOpenSound.volume = 0.6;


let isDragging = false;
let wasDragged = false;
let isAnimating = false;
let startX, startY;
let currentX = -25;
let currentY = 45;
const DRAG_THRESHOLD = 5;
let expandedFace = null;

const PART_NAMES = {
    frame: 'Frame',
    wheelback: 'Back wheel',
    seatt: 'Seat / seatpost',
    crank: 'Star / cranks',
    keychain: 'Chain',
    fork: 'Fork',
    stem: 'Stem',
    bar: 'Bar',
    wheelfront: 'Front wheel'
};

const PART_DESCRIPTIONS = {
    frame: `
        <strong>Рама (Frame)</strong> — основа велосипеда.
        <br><br>
        Рама определяет геометрию велосипеда, его прочность и вес. Изготавливается из хромомолибденовой стали (Cr-Mo) или Hi-Ten.
        <br><br>
        (High-Tensile Steel — высокопрочная сталь) — это углеродистая конструкционная сталь, наиболее часто используемая для изготовления бюджетных рам, вилок и рулей велосипедов начального уровня.
        <br><br>
        (CroMo (хромомолибденовая) сталь — это высокопрочный легированный сплав, содержащий хром (Cr) и молибден (Mo). Она отличается высокой прочностью, вязкостью, устойчивостью к усталостным нагрузкам и коррозии.
    `,
    wheelback: `
        <strong>Заднее колесо</strong> — Состоит из обода(rim), спиц, втулки (hub) и покрышки.
        <br><br>
        Обода быват двойные и одинарные, преимущественного из алюминия 6061, но бывают и из 7075 алиминия (космического).
        <br><br>
        Покрышки различаются шириной и тросом, покрышки широйной от 2.3 дюйма считаются широкими. Трос в оснвном стальной, но бывает и кевларовый для облегчения и прочности, но он дороже.
        <br><br>
        Корпус втулки чаще всего тоже делается из алюминия 6061 и 7075. Втулки бывают касетные и freecoaster. Касетная втулка - стандартая втулка которая используется на большиства велосипедах, в то время как freecoaster придуман для для BMX-райдеров, чтобы при езде назад (фейки) не нужно было крутить педали вслед за колесом.
        <br><br>
        Спицы делают из высокопрочной стали. Они бывают разной длины, в зависимости высоты фланцев втулки. Есть много видов спицовок колеса, самое плохое решение - солнышком, потому что она не выдерживает боковых и крутящих нагрузок. Лучшее решение - в 3 креста.
    `,
    seatt: `
        <strong>Седло / подседельный штырь (Seat / Seatpost)</strong> — преимущественно для удержания коленями во время выполнения трюков.
        <br><br>
        Сидушка на BMX бывает 3-ёх видов: комбо (когда седло и штырь одно целое), tripod седло имеет 3 точки крепления со штырём и pivotal - одна точка крепления со штырём + возможность регулировать угол наклона.
        <br><br>
        Наиболее популярны комбо сёдля для парка, поскольку у них меньше вес. Для стрита чаще всего используют пивотал, поскольку более удобно и весь не так сильно важен.
        <br><br>
        Также различается и толщина седла: в стриту блльше используется сёдла fat, то есть толстые, так как при езеде чаще приходится сидеть, в парке же для облегчения конструкии используют slim, то есть тонкие.
    `,
    crank: `
        <strong>Звезда / шатуны (Star / Cranks)</strong> Шатуны иногда ещё называют палками.
        <br><br>
        Шатуны различаются по шлицам, длине и материалу. Шлицы - продольные выступы (зубья) на посадочном месте, которые входят в зацепление с валом (кареткой), обеспечивая жесткое соединение. Быаают 8, 16 и 48 шлицов, чем больше тем лучше и дороже. Делаются шатуны из CroMo и Hi-Ten. Длина зависит от предпочтений и роста райдера, идёт от 160 до 175 мм, с шагом 5 мм.
        <br><br>
        Звёзды между собой различаются кол-вом зубьев, посадочным отверстием и материалом. Зубьев чаще всего 25, но може  быть и до 28. Чем больше зубьев, тем сложнее крутить и тем быстрее едешь, так как на задней втулке стандартом идёт 9 зубьев. Звезда надевается на вал каретки (куда вставляются шатуны) и крепится болтом к шатуну. Чаще всего деалют их из алюминия 5052 и 6061, в редких случаях используют космический.
        <br><br>
        Также бывают двух эелемнтые и трёх элементные шатуны, 2-ух элментные - когад вал вварен в один из шатунов, 3-ёх элементые - когда вал сам по себе. Бывают ещё одноэлементные шатуны, называемые кочергой - изогнутая стальная деталь, которая совмещает оба рычага педалей и вал.
    `,
    keychain: `
        <strong>Цепь (Chain)</strong> — связывает между собой переднюю и заднюю звёзды.
        <br><br>
        Цепи всегда идёт длинее чем нужно, поэтому отдельно надо купить выжемку. Различаются цепи на BMX в основном дизайном, есть стандартные, часто называют КМС, и Half-Link, у них каждое звено с одной стороны находится в другом звене, а с другой стороны находится поверх другого звена.
        <br><br>
    `,
    fork: `
        <strong>Вилка (Fork)</strong> — непосредственно основа велосипеда.
        <br><br>
        Вилка изготавливается из хромомолибденовой стали (Cr-Mo) или Hi-Ten. Состоит из штока и ножек, шток вставляется в раму и крепется за счёт top cap к выносу. На геометрию также влияет и выбег дропаутов викли (то за что держится втулка), чем больше выбег, тем дальше колесо находится от тебя и тем длинее байк.
        <br><br>
        В парке использют часто вилку с коротким выбегом для более удобного вращения, в стрите используются вилки с большим выбегом для стабильсти катания.
    `,
    stem: `
        <strong>Вынос (Stem)</strong> — надевается на шток вилки и держит руль.
        <br><br>
        Вынос делает из 6061 или космического алюмния. Сами выносы делятся на front-load и top-load. Если нужно чтоб руль был выше и ближе рекомендуется брать top-load. Если нужно чтоб руль был ниже и дальше рекомендуется брать front-load. Front-load чаще выглядит серьёзнее в то время как top-load более эстетично, хотя кому как.
        <br><br>
        Front-load - крышка выноса крепится спереди, top-load - крышка выноса крепится сверху.
    `,
    bar: `
        <strong>Руль ( Bar)</strong> — вместе с раомй,(выносом) и вилкой образуют frame set.
        <br><br>
        Руль изготавливается из хромомолибденовой стали (Cr-Mo) или Hi-Ten. Бывает высотой от 8.5 до 11 дюймов и то стандарт считается 9.5. Ширина у руля 27 - 30 дюймов, многие пилят руль.
        <br><br>
        При сборке рекомендуется ставить руль под тем же углом что и вилка, если руль наклонён сильно вперёд это называется чикаго и может быть опасно при нагрузках (в зависмости от степени наклона).
        <br><br>
        Рули бывают 2-ух елемнтным  и 4-х элементными. Считается, что 2-ух элементные урли прочнее, однако 4-ёх эелемнтные выгледят более дерзко и современно.
    `,
    wheelfront: `
        <strong>Переднее колесо</strong> - состоит из обода(rim), спиц, втулки (hub) и покрышки.
        <br><br>
        Хоть обода и бывают двойные, на переднее колесо можно ставить одинарный и тем самым сделать колесо более лёгким, поскольку нагрузки на него идёт меньше. И по стандарту сичтается что на каждом ободе (колесе) должно быть по 36 спиц, больше если уже лишний вес и прочности не добавляет, а если меньше то может быть менее прочным.
        <br><br>
        Покрышка сама по себе не держит воздух, наполняем воздухом мы именно камеру внутри покрышки, однако давление, которое может выдержать колесо зависит именно от покрышки, есть 2 системы изменерия давления, на покрышках чатсо пишут макисмальное кол-во psi, но максимально возможное - 110. Также бывают накачивают по атмосферам (Барам) максимум рекомендуется 5 атмосфер, но лучше перевести в psi и посмотреть на покрышке максимальное psi.
        <br><br>
        Вутлка на переднем колесе симетрична, поскольку в ней нет драйвера (звёздочки) как на задней втулке. Чем ниже фланцы на втулке, тем более прочная она.
    `
};


const partsSizes = {
  'framee.png': { width: 420, height: 220 },
  'forkk.png': { width: 260, height: 200 },
  'barr.png': { width: 320, height: 160 },
  'stemm.png': { width: 160, height: 140 },
  'seatt.png': { width: 200, height: 140 },
  'keychainn.png': { width: 320, height: 180 },
  'crankk.png': { width: 180, height: 150 },
  'wheelbackk.png': { width: 320, height: 320 },
  'wheelfrontt.png': { width: 140, height: 140 },
};

const PART_SCALES = {
    framee: 0.8,
    wheelbackk: 0.8,
    seatt: 0.8,
    keychainn: 0.8,
    forkk: 0.9,
    barr: 0.9,
    stemm: 0.9,
    crankk: 0.8,
    wheelfrontt: 0.8    
};

const MAX_PART_WIDTH = window.innerWidth * 0.6;
const MAX_PART_HEIGHT = window.innerHeight * 0.6;

const ANIMATION_CONFIG = {
    rotationDuration: 1000,
    expansionDuration: 600,
    rotationEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    expansionEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
};

const FACE_ROTATIONS = {
    front:  { x: 0,   y: 0   },
    back:   { x: 0,   y: 180 },
    right:  { x: 0,   y: -90  },
    left:   { x: 0,   y: 90 },
    top:    { x: -90, y: 0   },
    bottom: { x: 90,  y: 0   }
};

document.addEventListener('selectstart', (e) => e.preventDefault());
document.addEventListener('dragstart', (e) => e.preventDefault());
document.body.style.userSelect = 'none';
document.body.style.webkitUserSelect = 'none';

cube.addEventListener('mousedown', (e) => {
    if (isAnimating || expandedFace) return;
    
    isDragging = false;
    wasDragged = false;
    startX = e.clientX;
    startY = e.clientY;
    cube.style.cursor = 'grabbing';
    cube.style.transition = 'none';
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (startX === undefined || startY === undefined) return;
    if (expandedFace) return; 
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > DRAG_THRESHOLD) {
        if (!isDragging) {
            isDragging = true;
            wasDragged = true;
        }
        
        currentY += dx * 0.3;
        currentX -= dy * 0.3;
        
        currentX = Math.max(-90, Math.min(90, currentX));
        
        cube.style.transition = 'transform 0.1s ease-out'; 
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        
        startX = e.clientX;
        startY = e.clientY;
    }
    
    e.preventDefault();
});

document.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;
    }
    cube.style.cursor = 'grab';
    cube.style.transition = 'transform 0.2s ease-out';
    
    setTimeout(() => {
        startX = undefined;
        startY = undefined;
        wasDragged = false;
    }, 10);
    
    e.preventDefault();
});

faces.forEach(face => {
    face.addEventListener('click', (e) => {
        if (expandedFace) {
            e.preventDefault();
            return;
        }
        if (!wasDragged && !isAnimating) {
            const faceType = face.getAttribute('data-face');
            handleFaceClick(face, faceType);
        }
        e.preventDefault();
    });
});

if (backButton) {
    backButton.addEventListener('click', () => {
        collapseExpandedFace();
    });
}

const assemblyCloseBtn = document.getElementById('assemblyCloseBtn');
if (assemblyCloseBtn) {
    assemblyCloseBtn.addEventListener('click', () => {
        const assemblyPanel = document.getElementById('assemblyPanel');
        if (assemblyPanel) {
            assemblyPanel.classList.remove('visible');
        }
    });
}

const partInfoCloseBtn = document.getElementById('partInfoCloseBtn');
if (partInfoCloseBtn) {
    partInfoCloseBtn.addEventListener('click', () => {
        const partInfoPanel = document.getElementById('partInfoPanel');
        if (partInfoPanel) {
            partInfoPanel.classList.remove('visible');
        }
    });
}

function handleFaceClick(faceElement, faceType) {
    isAnimating = true;
    
    if (faceType === 'top') {
        handleTopFaceClick(faceElement);
        return;
    }

    if (faceType === 'right') {
        handlePartsFaceClick(faceElement);
        return;
    }

    if (faceType === 'bottom') {
        handleBuildFaceClick(faceElement);
        return;
    }

    if (faceType === 'back') {
        handleTricksFaceClick(faceElement);
        return;
    }
    
    rotateCubeToFace(faceType, () => {
        expandFaceToFullscreen(faceElement);
    });
}

function handleTricksFaceClick(faceElement) {
    rotateCubeToFace('back', () => {
        expandFaceToFullscreen(faceElement);
        setTimeout(() => {
            const tricksContainer = document.getElementById('tricks-container');
            if (tricksContainer) {
                tricksContainer.classList.add('visible');
            }
            loadTricksVideos();
            expandedFace = faceElement;
            setTimeout(() => {
                showBackButton(faceElement);
            }, 300);
            isAnimating = false;
        }, ANIMATION_CONFIG.expansionDuration);
    });
}

function loadTricksVideos() {
    const container = document.getElementById('tricks-container');
    if (!container) return;
    
    container.innerHTML = '';
    const tricksTitle = document.createElement('h2');
    tricksTitle.className = 'tricks-title';
    tricksTitle.textContent = 'How to';
    container.appendChild(tricksTitle);

    const tricksGrid = document.createElement('div');
    tricksGrid.className = 'tricks-grid';
    container.appendChild(tricksGrid);
    
    const videos = [
        { id: 1, title: 'Bunny Hop', videoUrl: 'resource/Bunny_Hop.mp4' },
        { id: 2, title: 'Manual', videoUrl: 'resource/Manual.mp4' },
        { id: 3, title: 'Barspin', videoUrl: 'resource/Barspin.mp4' },
        { id: 4, title: 'Bunny Hop 180', videoUrl: 'resource/Bunny_Hop_180.mp4' },
        { id: 5, title: 'Footjam', videoUrl: 'resource/Footjam.mp4' },
        { id: 6, title: 'Drop', videoUrl: 'resource/Drop.mp4' }
    ];
        videos.forEach((video) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'trick-video-card';
        videoCard.dataset.videoId = video.id;
        
        const preview = document.createElement('div');
        preview.className = 'trick-video-preview';
        
        const previewVideo = document.createElement('video');
        previewVideo.src = video.videoUrl;
        previewVideo.preload = 'metadata';
        previewVideo.style.display = 'none';
        
        previewVideo.addEventListener('loadedmetadata', () => {
            previewVideo.currentTime = 1;
        });
        
        previewVideo.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = previewVideo.videoWidth;
            canvas.height = previewVideo.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(previewVideo, 0, 0, canvas.width, canvas.height);
            preview.style.backgroundImage = `url(${canvas.toDataURL()})`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
        });
        
        const playIcon = document.createElement('div');
        playIcon.className = 'trick-play-icon';
        playIcon.innerHTML = '▶';
        preview.appendChild(playIcon);
        
        videoCard.appendChild(preview);
        
        const title = document.createElement('div');
        title.className = 'trick-video-title';
        title.textContent = video.title;
        videoCard.appendChild(title);
        
        videoCard.addEventListener('click', () => {
            openTrickVideo(video);
        });
        
        tricksGrid.appendChild(videoCard);
    });
}

function openTrickVideo(video) {
    console.log('Открываем видео:', video);
    const container = document.getElementById('tricks-container');
    if (!container) {
        console.error('Контейнер tricks-container не найден');
        return;
    }
    
    container.classList.remove('visible');
    
    const playerContainer = document.getElementById('trick-player-container');
    if (playerContainer) {
        playerContainer.innerHTML = '';
        
        const isLocalFile = video.videoUrl.startsWith('resource/') || !video.videoUrl.startsWith('http');
        
        if (isLocalFile) {
            const videoElement = document.createElement('video');
            videoElement.className = 'trick-video-player';
            videoElement.src = video.videoUrl;
            videoElement.controls = true;
            videoElement.autoplay = false;
            videoElement.preload = 'metadata';
            
            videoElement.addEventListener('error', (e) => {
                console.error('Ошибка загрузки видео:', video.videoUrl);
                alert('Не удалось загрузить видео. Проверьте путь к файлу.');
            });
            
            playerContainer.appendChild(videoElement);
        } else {
            const iframe = document.createElement('iframe');
            iframe.className = 'trick-video-player';
            iframe.src = video.videoUrl;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.width = '90vw';
            iframe.style.height = '90vh';
            iframe.style.border = '3px solid #ff6b35';
            iframe.style.borderRadius = '12px';
            
            playerContainer.appendChild(iframe);
        }
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'trick-video-close';
        closeBtn.innerHTML = '✕';
        closeBtn.addEventListener('click', () => {
            closeTrickVideo();
        });
        
        playerContainer.insertBefore(closeBtn, playerContainer.firstChild);
        playerContainer.classList.add('visible');
    }
}

function closeTrickVideo() {
    const playerContainer = document.getElementById('trick-player-container');
    const container = document.getElementById('tricks-container');
    
    if (playerContainer) {
        const iframe = playerContainer.querySelector('iframe');
        if (iframe) {
            iframe.src = '';
        }
        const video = playerContainer.querySelector('video');
        if (video) {
            video.pause();
            video.src = '';
        }
        playerContainer.innerHTML = '';
        playerContainer.classList.remove('visible');
    }
    
    if (container) {
        container.classList.add('visible');
    }
}

function handleTopFaceClick(faceElement) {
    rotateCubeTopUp(() => {
        moveCubeDownAndShowModel();
    });
}

function rotateCubeTopUp(callback) {
    const targetX = -10;
    const targetY = 45;
    
    let normalizedCurrentY = ((currentY % 360) + 360) % 360;
    
    let normalizedTargetY = ((targetY % 360) + 360) % 360;
    
    let diffY = normalizedTargetY - normalizedCurrentY;
    
    if (diffY > 180) {
        diffY -= 360;
    } else if (diffY < -180) {
        diffY += 360;
    }
    
    currentY = currentY + diffY;
    currentX = targetX;
    
    cube.style.transition = `transform ${ANIMATION_CONFIG.rotationDuration}ms ${ANIMATION_CONFIG.rotationEasing}`;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    
    setTimeout(() => {
        if (callback) callback();
    }, ANIMATION_CONFIG.rotationDuration);
}

function handlePartsFaceClick(faceElement) {
    rotateCubeToFace('right', () => {
        expandFaceToFullscreen(faceElement);
        setTimeout(() => {
            const partsContainer = document.getElementById('parts-container');
            if (partsContainer) {
                partsContainer.classList.add('visible');
            }
            loadPartsImages();
            expandedFace = faceElement;
            
            const assemblyPanel = document.getElementById('assemblyPanel');
            if (assemblyPanel) {
                assemblyPanel.classList.add('visible');
            }
            
            setTimeout(() => {
                showBackButton(faceElement);
            }, 300);
            isAnimating = false;
        }, ANIMATION_CONFIG.expansionDuration);
    });
}

function handleBuildFaceClick(faceElement) {
    rotateCubeToFace('bottom', () => {
        expandFaceToFullscreen(faceElement);
        setTimeout(() => {
            const partsContainer = document.getElementById('parts-container');
            if (partsContainer) {
                partsContainer.classList.add('visible', 'build-mode');
            }
            loadBuildImages();
            expandedFace = faceElement;
            setTimeout(() => {
                showBackButton(faceElement);
            }, 300);
            isAnimating = false;
        }, ANIMATION_CONFIG.expansionDuration);
    });
}

function loadPartsImages() {
    const container = document.getElementById('parts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    const parts = [
        {
            name: 'frame',
            image: 'framee.png',
            isBase: true,
            position: null
        },
        {
            name: 'wheelback',
            image: 'wheelbackk.png',
            isBase: false,
            position: { x: 140, y: 750},
            snapZone:{
              x: 364,
              y: 290,
              width: 293.3,
              height: 463.9
            }
        },
        {
            name: 'seatt',
            image: 'seatt.png',
            isBase: false,
            position: { x: 120, y: 800 }, 
            snapZone: {
                x: 545,
                y: 215,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'crank',
            image: 'crankk.png',
            isBase: false,
            position: { x: 750, y: 120 }, 
            snapZone: {
                x: 636,
                y: 355,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'keychain',
            image: 'keychainn.png',
            isBase: false,
            position: { x: 458, y: 596 }, 
            snapZone: {
                x: 515,
                y: 360,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'fork',
            image: 'forkk.png',
            isBase: false,
            position: { x: 235, y: 98 }, 
            snapZone: {
                x: 858,
                y: 268  ,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'stem',
            image: 'stemm.png',
            isBase: false,
            position: { x: 896, y: 358 }, 
            snapZone: {
                x: 824,
                y: 122,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'bar',
            image: 'barr.png',
            isBase: false,
            position: { x: 236, y: 695 }, 
            snapZone: {
                x: 809,
                y: 56,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'wheelfront',
            image: 'wheelfrontt.png',
            isBase: false,
            position: { x: 156, y: 581 }, 
            snapZone: {
                x: 915,
                y: 387,
                width: 168.8,
                height: 304
            }
        }
        
    ];
    
    parts.forEach((part) => {
        const img = document.createElement('img');
        img.src = `resource/${part.image}`;
        img.className = 'part-image';
        img.dataset.partName = part.name;
        img.dataset.isBase = part.isBase;
        img.draggable = false;
        
        img.onload = () => {
            const imgWidth = img.naturalWidth || img.width || 0;
            const imgHeight = img.naturalHeight || img.height || 0;

            img.dataset.width = imgWidth;
            img.dataset.height = imgHeight;

            const baseName = part.image.replace(/\.\w+$/, '');
            const scale = PART_SCALES[baseName] ?? 1;
            let displayW = imgWidth * scale;
            let displayH = imgHeight * scale;

            const ratio = displayW / displayH;
            if (displayW > MAX_PART_WIDTH) {
                displayW = MAX_PART_WIDTH;
                displayH = displayW / ratio;
            }
            if (displayH > MAX_PART_HEIGHT) {
                displayH = MAX_PART_HEIGHT;
                displayW = displayH * ratio;
            }

            img.style.width = `${displayW}px`;
            img.style.height = `${displayH}px`;

            let posX = part.position?.x ?? 0;
            let posY = part.position?.y ?? 0;

            if (part.isBase) {
                posX = 465;
                posY = 283;
            } else {
                posX = Math.max(0, Math.min(containerWidth - imgWidth, posX));
                posY = Math.max(0, Math.min(containerHeight - imgHeight, posY));
            }

            img.style.left = `${posX}px`;
            img.style.top = `${posY}px`;
        };
        
        if (part.isBase) {
            img.classList.add('part-base');
        } else {
            setupPartDragging(img, container, part);
        }
        
        container.appendChild(img);
    });
}

function loadBuildImages() {
    const container = document.getElementById('parts-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    const buildParts = [
        {
            name: 'frame',
            image: 'framee.png',
            isBase: true,
            position: null
        },
        {
            name: 'wheelback',
            image: 'wheelbackk.png',
            snapZone: {
                x: 420,
                y: 328,
                width: 293.3,
                height: 463.9
            }
        },
        {
            name: 'seatt',
            image: 'seatt.png',
            snapZone: {
                x: 605,
                y: 253,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'crank',
            image: 'crankk.png',
            snapZone: {
                x: 695,
                y: 393,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'keychain',
            image: 'keychainn.png',
            snapZone: {
                x: 570,
                y: 397,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'fork',
            image: 'forkk.png',
            snapZone: {
                x: 920,
                y: 306,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'bar',
            image: 'barr.png',
            snapZone: {
                x: 870,
                y: 94,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'stem',
            image: 'stemm.png',
            snapZone: {
                x: 885,
                y: 160,
                width: 168.8,
                height: 304
            }
        },
        {
            name: 'wheelfront',
            image: 'wheelfrontt.png',
            snapZone: {
                x: 977,
                y: 425,
                width: 168.8,
                height: 304
            }
        }
    ];
    
    buildParts.forEach((part) => {
        const img = document.createElement('img');
        img.src = `resource/${part.image}`;
        img.className = 'part-image build-part';
        img.dataset.partName = part.name;
        img.draggable = false;

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const partName = PART_NAMES[part.name] || part.name;
            
            const partText = PART_DESCRIPTIONS[part.name] || `
                <strong>${partName}</strong> — описание детали.
                <br><br>
                Подробная информация о ${partName.toLowerCase()}.
            `;

            
            document.getElementById('partInfoTitle').textContent = partName;
            document.getElementById('partInfoText').innerHTML = partText;
            
            const partInfoPanel = document.getElementById('partInfoPanel');
            if (partInfoPanel) {
                partInfoPanel.classList.add('visible');
            }
            
            container.querySelectorAll('.part-image').forEach(otherImg => {
                if (otherImg !== img) {
                    otherImg.classList.remove('selected');
                }
            });

            img.classList.add('selected');
        });
        
        img.onload = () => {
            const imgWidth = img.naturalWidth || img.width || 0;
            const imgHeight = img.naturalHeight || img.height || 0;

            img.dataset.width = imgWidth;
            img.dataset.height = imgHeight;

            const baseName = part.image.replace(/\.\w+$/, '');
            const scale = PART_SCALES[baseName] ?? 1;
            let displayW = imgWidth * scale;
            let displayH = imgHeight * scale;

            const ratio = displayW / displayH;
            if (displayW > MAX_PART_WIDTH) {
                displayW = MAX_PART_WIDTH;
                displayH = displayW / ratio;
            }
            if (displayH > MAX_PART_HEIGHT) {
                displayH = MAX_PART_HEIGHT;
                displayW = displayH * ratio;
            }

            img.style.width = `${displayW}px`;
            img.style.height = `${displayH}px`;

            let posX, posY;

            if (part.isBase) {
                posX = 527;
                posY = 318;
            } else {
                const zone = part.snapZone;
                posX = zone.x + (zone.width - displayW) / 2;
                posY = zone.y + (zone.height - displayH) / 2;
            }

            img.style.left = `${posX}px`;
            img.style.top = `${posY}px`;
        };
        
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Clicked part:', part.name);
        });
        
        container.appendChild(img);
    });
}

function setupPartDragging(partElement, container, partData) {
    let isDragging = false;
    let startX, startY;
    let isSnapped = false;
    
    const handleMouseDown = (e) => {
        const partsContainer = document.getElementById('parts-container');
        if (partsContainer && partsContainer.classList.contains('visible') && !isSnapped) {
            if (e.target === partElement || partElement.contains(e.target)) {
                isDragging = true;
                partElement.classList.add('dragging');
                
                const rect = partElement.getBoundingClientRect();
                startX = e.clientX - rect.left;
                startY = e.clientY - rect.top;
                
                e.preventDefault();
                e.stopPropagation();
            }
        }
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging || isSnapped) return;
        
        const partsContainer = document.getElementById('parts-container');
        if (!partsContainer || !partsContainer.classList.contains('visible')) {
            isDragging = false;
            partElement.classList.remove('dragging');
            return;
        }
        
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        let newX = e.clientX - startX;
        let newY = e.clientY - startY;
        
        const rect = partElement.getBoundingClientRect();
        const partW = rect.width;
        const partH = rect.height;

        const minX = 0;
        const minY = 0;
        const maxX = containerWidth - partW;
        const maxY = containerHeight - partH;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        partElement.style.left = `${newX}px`;
        partElement.style.top = `${newY}px`;

        if (partData.snapZone) {
            const partCenterX = newX + partW / 2;
            const partCenterY = newY + partH / 2;
            const zone = partData.snapZone;
            const zoneCenterX = zone.x + zone.width / 2;
            const zoneCenterY = zone.y + zone.height / 2;
            const distance = Math.hypot(partCenterX - zoneCenterX, partCenterY - zoneCenterY);
            if (distance < 80) partElement.classList.add('part-snapping');
            else partElement.classList.remove('part-snapping');
        }
        
        e.preventDefault();
    };
    
    const handleMouseUp = (e) => {
        if (!isDragging) return;
        
        if (partData.snapZone && !isSnapped) {
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;
            const rect = partElement.getBoundingClientRect();
            const partW = rect.width;
            const partH = rect.height;

            const partCenterX = rect.left + partW / 2;
            const partCenterY = rect.top + partH / 2;

            const zone = partData.snapZone;
            const zoneCenterX = zone.x + zone.width / 2;
            const zoneCenterY = zone.y + zone.height / 2;

            const distance = Math.hypot(partCenterX - zoneCenterX, partCenterY - zoneCenterY);

            if (distance < 80) {
                partElement.style.left = `${zoneCenterX - partW / 2}px`;
                partElement.style.top = `${zoneCenterY - partH / 2}px`;
                isSnapped = true;
                partElement.classList.add('part-snapped');
                partElement.classList.remove('dragging', 'part-snapping');
                
                
                setTimeout(() => {
                    if (checkAllPartsAssembled()) {
                        autoTransitionToBuild();
                    }
                }, 100);
            }
        }
        
        isDragging = false;
        partElement.classList.remove('dragging', 'part-snapping');
    };
    
    partElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function checkAllPartsAssembled() {
    const container = document.getElementById('parts-container');
    if (!container || !container.classList.contains('visible')) return false;
    
    const allParts = container.querySelectorAll('.part-image:not(.part-base)');
    const snappedParts = container.querySelectorAll('.part-image.part-snapped');
    
    console.log('Всего деталей:', allParts.length, 'Зафиксировано:', snappedParts.length);
    
    const allAssembled = allParts.length > 0 && allParts.length === snappedParts.length;
    
    if (allAssembled) {
        console.log('Все детали собраны! Переход на build...');
    }
    
    return allAssembled;
}

function autoTransitionToBuild() {
    const currentFace = expandedFace;
    if (!currentFace || currentFace.getAttribute('data-face') !== 'right') {
        console.log('Не на стороне parts, переход отменён');
        return;
    }
    
    console.log('Начинаем автоматический переход на build...');
    
    setTimeout(() => {
        collapseExpandedFace();
        
        setTimeout(() => {
            const buildFace = document.querySelector('.face.bottom');
            if (buildFace) {
                console.log('Открываем сторону build');
                handleBuildFaceClick(buildFace);
            }
        }, ANIMATION_CONFIG.expansionDuration + 2000);
    }, 500);
}

function moveCubeDownAndShowModel() {
    const scene = document.querySelector('.scene');
    const container = document.getElementById('bmx-3d-container');
    const topFace = document.querySelector('.face.top');
    const sideFaces = document.querySelectorAll('.face.front, .face.back, .face.right, .face.left');
    
    if (!topFace) return;
    
    topFace.classList.add('light-flash');
    
    scene.classList.add('cube-moved-down');
    if (topFace) {
        topFace.style.opacity = '0';
        topFace.style.pointerEvents = 'none';
        topFace.style.transition = 'opacity 1.2s ease';
    }
    sideFaces.forEach(face => {
        face.style.boxShadow = `
            0 0 30px rgba(255, 255, 255, 0.5),
            0 0 60px rgba(255, 255, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.2)
        `;
        face.style.borderColor = '#ffffff';
        face.style.transition = 'box-shadow 1.2s ease, border-color 1.2s ease';
    });
    
    setTimeout(() => {
        topFace.classList.remove('light-flash');
    }, 800);
    
    loadBMXModel(() => {
        setTimeout(() => {
            if (container) {
                container.classList.add('visible');
            }
            
            if (topFace) {
                expandedFace = topFace;
                setTimeout(() => {
                    showBackButton(topFace);
                }, 300);
            }
            
            isAnimating = false;
        }, 100);
    });
}



function rotateCubeToFace(faceType, callback) {
    const targetRotation = FACE_ROTATIONS[faceType];
    
    if (!targetRotation) {
        console.error('Unknown face type:', faceType);
        isAnimating = false;
        return;
    }
    
    let normalizedCurrentY = ((currentY % 360) + 360) % 360;
    
    let targetY = targetRotation.y;
    targetY = ((targetY % 360) + 360) % 360;
    
    let diff = targetY - normalizedCurrentY;
    
    if (diff > 180) {
        diff -= 360;
    } else if (diff < -180) {
        diff += 360;
    }
    
    currentY = currentY + diff;
    
    currentX = targetRotation.x;
    
    cube.style.transition = `transform ${ANIMATION_CONFIG.rotationDuration}ms ${ANIMATION_CONFIG.rotationEasing}`;
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
    
    setTimeout(() => {
        if (callback) callback();
    }, ANIMATION_CONFIG.rotationDuration);
}

function expandFaceToFullscreen(faceElement) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const faceSize = 200;
    
    const scaleX = (screenWidth * 0.95) / faceSize;
    const scaleY = (screenHeight * 0.95) / faceSize;
    
    const scale = Math.min(scaleX, scaleY);
    
    const expandedWidth = screenWidth * 0.95;
    const expandedHeight = (faceSize * scale);
    
    const computedStyle = window.getComputedStyle(faceElement);
    const originalTransform = computedStyle.transform;
    
    const faceClass = Array.from(faceElement.classList).find(cls => 
        ['front', 'back', 'right', 'left', 'top', 'bottom'].includes(cls)
    );
    
    const faceOrientations = {
        front: '',
        back: 'rotateY(180deg)',
        right: 'rotateY(90deg)',
        left: 'rotateY(-90deg)',
        top: 'rotateX(90deg)',
        bottom: 'rotateX(-90deg)'
    };
    
    const faceOrientation = faceOrientations[faceClass] || '';
    
    faceElement.classList.add('expanded');
    
    faceElement.style.position = 'fixed';
    faceElement.style.left = '50%';
    faceElement.style.top = '50%';
    faceElement.style.margin = '0';
    faceElement.style.width = '200px';
    faceElement.style.height = '200px';
    faceElement.style.transform = `translate(-50%, -50%) ${faceOrientation} scale(1)`;
    faceElement.style.zIndex = '1000';
    
    if (faceOpenSound) {
        try {
            faceOpenSound.currentTime = 0;
            faceOpenSound.play().catch(() => {});
        } catch (e) {
            console.warn('Cannot play faceOpenSound', e);
        }
    }

    requestAnimationFrame(() => {
        faceElement.style.transition = `
            transform ${ANIMATION_CONFIG.expansionDuration}ms ${ANIMATION_CONFIG.expansionEasing},
            width ${ANIMATION_CONFIG.expansionDuration}ms ${ANIMATION_CONFIG.expansionEasing},
            height ${ANIMATION_CONFIG.expansionDuration}ms ${ANIMATION_CONFIG.expansionEasing}
        `;
        faceElement.style.width = `${expandedWidth}px`;
        faceElement.style.height = `${expandedHeight}px`;
        faceElement.style.transform = `translate(-50%, -50%) ${faceOrientation} scale(1)`;
    });
    
    setTimeout(() => {
        console.log('Face expanded to fullscreen');
        expandedFace = faceElement;
        cube.classList.add('cube-expanded');
        showBackButton(faceElement);
        isAnimating = false;
    }, ANIMATION_CONFIG.expansionDuration);
}

function collapseExpandedFace() {
    
    if (!expandedFace || isAnimating) return;

    const faceType = expandedFace.getAttribute('data-face');
    if (faceType === 'top') {
        collapseTopFace();
        return;
    }

    const assemblyPanel = document.getElementById('assemblyPanel');
    if (assemblyPanel) {
        assemblyPanel.classList.remove('visible');
    }

    const partInfoPanel = document.getElementById('partInfoPanel');
    if (partInfoPanel) {
        partInfoPanel.classList.remove('visible');
    }

    if (faceType === 'back') {
        const tricksContainer = document.getElementById('tricks-container');
        const playerContainer = document.getElementById('trick-player-container');
        if (tricksContainer) {
            tricksContainer.classList.remove('visible');
            tricksContainer.innerHTML = '';
        }
        if (playerContainer) {
            const video = playerContainer.querySelector('video');
            if (video) {
                video.pause();
                video.src = '';
            }
            playerContainer.innerHTML = '';
            playerContainer.classList.remove('visible');
        }
    }

    if (faceType === 'right' || faceType === 'bottom') {
        const partsContainer = document.getElementById('parts-container');
        if (partsContainer) {
            partsContainer.classList.remove('visible', 'build-mode');
            partsContainer.innerHTML = '';
        }
        
        const tooltip = document.querySelector('.part-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
            tooltip.style.display = 'none';
        }
        
        const selectedParts = document.querySelectorAll('.part-image.selected');
        selectedParts.forEach(part => part.classList.remove('selected'));
    }

    isAnimating = true;
    hideBackButton();
    const faceElement = expandedFace;

    const faceClass = Array.from(faceElement.classList).find(cls => 
        ['front', 'back', 'right', 'left', 'top', 'bottom'].includes(cls)
    );
    
    const faceOrientations = {
        front: '',
        back: 'rotateY(180deg)',
        right: 'rotateY(90deg)',
        left: 'rotateY(-90deg)',
        top: 'rotateX(90deg)',
        bottom: 'rotateX(-90deg)'
    };
    
    const faceOrientation = faceOrientations[faceClass] || '';

    faceElement.style.transition = `
        transform ${ANIMATION_CONFIG.expansionDuration}ms ${ANIMATION_CONFIG.expansionEasing},
        width ${ANIMATION_CONFIG.expansionDuration}ms ${ANIMATION_CONFIG.expansionEasing},
        height ${ANIMATION_CONFIG.expansionDuration}ms ${ANIMATION_CONFIG.expansionEasing}
    `;

    requestAnimationFrame(() => {
        faceElement.style.width = '200px';
        faceElement.style.height = '200px';
        faceElement.style.transform = `translate(-50%, -50%) ${faceOrientation} scale(1)`;
    });

        setTimeout(() => {
        resetFaceStyles(faceElement);
        expandedFace = null;
        cube.classList.remove('cube-expanded');
        
        const targetX = -25;
        const targetY = 45;
        
        let normalizedCurrentY = ((currentY % 360) + 360) % 360;
        
        let normalizedTargetY = ((targetY % 360) + 360) % 360;
        
        let diffY = normalizedTargetY - normalizedCurrentY;
        
        if (diffY > 180) {
            diffY -= 360;
        } else if (diffY < -180) {
            diffY += 360;
        }
        
        currentY = currentY + diffY;
        currentX = targetX;
        
        cube.style.transition = `transform ${ANIMATION_CONFIG.rotationDuration}ms ${ANIMATION_CONFIG.rotationEasing}`;
        cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
        
        setTimeout(() => {
            isAnimating = false;
        }, ANIMATION_CONFIG.rotationDuration);
    }, ANIMATION_CONFIG.expansionDuration);
}

function collapseTopFace() {
    if (isAnimating) return;
    isAnimating = true;
    
    const topFace = document.querySelector('.face.top');
    const sideFaces = document.querySelectorAll('.face.front, .face.back, .face.right, .face.left');

    if (topFace) {
        topFace.style.opacity = '';
        topFace.style.pointerEvents = '';
        topFace.style.transition = 'opacity 1.2s ease';
    }

    sideFaces.forEach(face => {
        face.style.boxShadow = '';
        face.style.borderColor = '';
        face.style.transition = 'box-shadow 1.2s ease, border-color 1.2s ease';
    });

    hideBackButton();
    
    const scene = document.querySelector('.scene');
    const container = document.getElementById('bmx-3d-container');
    
    if (container) {
        container.classList.remove('visible');
    }

     setTimeout(() => {
        cleanupBMXModel();
    }, 600);
    
    setTimeout(() => {
        scene.classList.remove('cube-moved-down');
        
        setTimeout(() => {
            const targetX = -25;
            const targetY = 45;
            
            let normalizedCurrentY = ((currentY % 360) + 360) % 360;
            let normalizedTargetY = ((targetY % 360) + 360) % 360;
            let diffY = normalizedTargetY - normalizedCurrentY;
            
            if (diffY > 180) {
                diffY -= 360;
            } else if (diffY < -180) {
                diffY += 360;
            }
            
            currentY = currentY + diffY;
            currentX = targetX;
            
            cube.style.transition = `transform ${ANIMATION_CONFIG.rotationDuration}ms ${ANIMATION_CONFIG.rotationEasing}`;
            cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            
            expandedFace = null;
            
            setTimeout(() => {
                isAnimating = false;
            }, ANIMATION_CONFIG.rotationDuration);
        }, 600);
    }, 200);
}

function resetFaceStyles(faceElement) {
    const propsToReset = [
        'position',
        'left',
        'top',
        'margin',
        'width',
        'height',
        'zIndex',
        'transition'
    ];

    propsToReset.forEach(prop => {
        faceElement.style[prop] = '';
    });
    
    faceElement.style.transform = '';

    faceElement.classList.remove('expanded');
}

function showBackButton(faceElement) {
    if (!backButton) return;
    positionBackButton(faceElement);
    backButton.classList.add('visible');
}

function hideBackButton() {
    if (backButton) {
        backButton.classList.remove('visible');
    }
}

function positionBackButton(faceElement) {
    if (!backButton) return;
    backButton.style.left = '60px';
    backButton.style.top = '30px';
}

window.addEventListener('resize', () => {
    if (bmxRenderer && bmxCamera) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        bmxCamera.aspect = screenWidth / screenHeight;
        bmxCamera.updateProjectionMatrix();
        bmxRenderer.setSize(screenWidth, screenHeight);
    }
    
    if (expandedFace && backButton && backButton.classList.contains('visible')) {
        positionBackButton(expandedFace);
    }
});


let bmxScene = null;
let bmxCamera = null;
let bmxRenderer = null;
let bmxModel = null;
let bmxIsDragging = false;
let bmxStartX = 0;
let bmxStartY = 0;
let bmxRotationX = 0;
let bmxRotationY = 0;
let bmxZoom = 5;
let targetRotationX = 0;
let targetRotationY = 0;
let targetZoom = 5;
let currentRotationX = 0;
let currentRotationY = 0;
let currentZoom = 5;

if (bmxModel) {
    bmxModel.rotation.x = 0;
    bmxModel.rotation.y = 0;
}

function loadBMXModel(callback) {
    const container = document.getElementById('bmx-3d-container');
    if (!container) {
        console.error('BMX 3D container not found');
        if (callback) callback();
        return;
    }
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    bmxScene = new THREE.Scene();
    bmxScene.background = new THREE.Color(0x2a2a2a);
    
    bmxCamera = new THREE.PerspectiveCamera(50, screenWidth / screenHeight, 0.1, 1000);
    bmxCamera.position.set(0, 0, 5);
    
    bmxRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    bmxRenderer.setSize(screenWidth, screenHeight);
    bmxRenderer.setClearColor(0x2a2a2a, 1);
    container.appendChild(bmxRenderer.domElement);
    
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({
       color: 0x252525,
       emissive: 0x2a1508,
       emissiveIntensity: 0.4,
       roughness: 0.8,
       metalness: 0.2
    });
    const backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    backgroundPlane.position.set(0, 0, -3);
    bmxScene.add(backgroundPlane);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    bmxScene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 4);
    mainLight.position.set(8, 6, 4);
    mainLight.castShadow = false;
    bmxScene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-5, 2, 3);
    bmxScene.add(fillLight);

    const accentLight = new THREE.DirectionalLight(0xffd4a3, 1.2);
    accentLight.position.set(6, 4, 2);
    bmxScene.add(accentLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 3, 15);
    pointLight1.position.set(5, 4, 3);
    bmxScene.add(pointLight1);
    
    const pointLight3 = new THREE.PointLight(0xff8e35, 2, 10);
    pointLight3.position.set(-2, 1, 2);
    bmxScene.add(pointLight3);
    
       bmxScene.fog = new THREE.Fog(0x252525, 5, 15);
    
    const loader = new THREE.GLTFLoader();
    loader.load(
        '3D/bmx.glb',
        (gltf) => {
            bmxModel = gltf.scene;
            bmxScene.add(bmxModel);

            bmxRotationX = 0;
            bmxRotationY = 0;
            bmxZoom = 5;
            
            const box = new THREE.Box3().setFromObject(bmxModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            bmxModel.position.x = -center.x;
            bmxModel.position.y = -center.y;
            bmxModel.position.z = -center.z;
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            bmxModel.scale.set(scale, scale, scale);
            
            animateBMX();
            setupBMXControls();
            
            if (callback) callback();
        },
        (progress) => {
            console.log('Loading progress:', progress);
        },
        (error) => {
            console.error('Error loading model:', error);
            if (callback) callback();
        }
    );
}

function cleanupBMXModel() {
    const container = document.getElementById('bmx-3d-container');
    
    if (bmxRenderer) {
        if (container && bmxRenderer.domElement) {
            container.removeChild(bmxRenderer.domElement);
        }
        
        if (bmxScene) {
            while(bmxScene.children.length > 0) {
                bmxScene.remove(bmxScene.children[0]);
            }
            bmxScene = null;
        }
        
        bmxRenderer.dispose();
        bmxRenderer = null;
        bmxCamera = null;
        bmxModel = null;
    }
    
    if (container) {
        container.classList.remove('visible');
    }
    
    bmxIsDragging = false;
    bmxStartX = 0;
    bmxStartY = 0;
    bmxRotationX = 0;
    bmxRotationY = 0;
    bmxZoom = 5;
    targetRotationX = 0;
    targetRotationY = 0;
    targetZoom = 5;
    currentRotationX = 0;
    currentRotationY = 0;
    currentZoom = 5;
}

function setupBMXControls() {
    const container = document.getElementById('bmx-3d-container');
    if (!container || !bmxRenderer) return;
    
    const canvas = bmxRenderer.domElement;
    
    canvas.addEventListener('mousedown', (e) => {
        if (!container.classList.contains('visible')) return;
        
        e.stopPropagation();
        
        bmxIsDragging = true;
        bmxStartX = e.clientX;
        bmxStartY = e.clientY;
        canvas.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!bmxIsDragging || !container.classList.contains('visible')) return;
        
        e.stopPropagation();
        
        const dx = e.clientX - bmxStartX;
        const dy = e.clientY - bmxStartY;
        
        targetRotationY += dx * 0.01;
        targetRotationX += dy * 0.01;
        
        targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));
        
        bmxStartX = e.clientX;
        bmxStartY = e.clientY;
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!bmxIsDragging) return;
        
        bmxIsDragging = false;
        canvas.style.cursor = 'grab';
    });
    
    canvas.addEventListener('wheel', (e) => {
        if (!container.classList.contains('visible')) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const zoomSpeed = 0.3;
        targetZoom += e.deltaY * zoomSpeed * 0.01;
        
        targetZoom = Math.max(0.5, Math.min(5, targetZoom));
    });
    
    canvas.addEventListener('mouseenter', () => {
        if (container.classList.contains('visible')) {
            canvas.style.cursor = 'grab';
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        canvas.style.cursor = 'default';
    });
}

function animateBMX() {
    if (!bmxRenderer || !bmxScene || !bmxCamera) return;
    
    requestAnimationFrame(animateBMX);
    
    if (bmxModel) {
        const rotationSpeed = 0.05;
        currentRotationX += (targetRotationX - currentRotationX) * rotationSpeed;
        currentRotationY += (targetRotationY - currentRotationY) * rotationSpeed;
        
        bmxModel.rotation.x = currentRotationX;
        bmxModel.rotation.y = currentRotationY;
        
        const time = Date.now() * 0.0005;
        const pointLight1 = bmxScene.children.find(child => child.type === 'PointLight' && child.position.y > 0);
        const pointLight2 = bmxScene.children.find(child => child.type === 'PointLight' && child.position.y < 0);
        
        if (pointLight1) {
            pointLight1.intensity = 2 + Math.sin(time) * 0.3;
        }
        if (pointLight2) {
            pointLight2.intensity = 1.5 + Math.cos(time) * 0.2;
        }
    }
    
    const zoomSpeed = 0.15;
    currentZoom += (targetZoom - currentZoom) * zoomSpeed;
    
    bmxCamera.position.z = currentZoom;
    
    bmxRenderer.render(bmxScene, bmxCamera);
}