document.addEventListener('DOMContentLoaded', function() {
    // Настройка сцены Three.js
    initThreeScene();
    
    // Запуск конфетти
    initConfetti();
    
    // Инициализация таймера обратного отсчета
    initCountdown();
    
    // Инициализация музыкального плеера
    initMusicPlayer();
});

// Функция инициализации 3D сцены с Three.js
function initThreeScene() {
    const canvas = document.getElementById('birthday-scene');
    const scene = new THREE.Scene();
    
    // Проверяем, является ли устройство мобильным
    const isMobile = window.innerWidth <= 768;
    
    // Настройка камеры
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    // Разная позиция камеры в зависимости от устройства
    if (isMobile) {
        camera.position.z = 7; // Увеличиваем расстояние для мобильных устройств
        camera.position.y = -1; // Сдвигаем камеру вниз, чтобы видеть торт
    } else {
        camera.position.z = 5;
    }
    
    // Настройка рендерера
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Добавляем освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Создаем 3D объекты
    // Создаем текст "19"
    const textGroup = new THREE.Group();
    scene.add(textGroup);
    
    // Создаем группу для всего торта
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);
    
    // Создаем геометрию торта
    const cakeBase = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 32);
    const cakeMaterial = new THREE.MeshPhongMaterial({ color: 0xffd6e7 });
    const cake = new THREE.Mesh(cakeBase, cakeMaterial);
    cake.position.y = -2;
    cakeGroup.add(cake);
    
    // Создаем средний слой торта
    const cakeMiddle = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
    const cakeMiddleMaterial = new THREE.MeshPhongMaterial({ color: 0xffb5e8 });
    const cakeMiddleMesh = new THREE.Mesh(cakeMiddle, cakeMiddleMaterial);
    cakeMiddleMesh.position.y = -1.5;
    cakeGroup.add(cakeMiddleMesh);
    
    // Создаем верхний слой торта
    const cakeTop = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32);
    const cakeTopMaterial = new THREE.MeshPhongMaterial({ color: 0xff85a2 });
    const cakeTopMesh = new THREE.Mesh(cakeTop, cakeTopMaterial);
    cakeTopMesh.position.y = -1;
    cakeGroup.add(cakeTopMesh);
    
    // Позиционируем всю группу торта для мобильных устройств
    if (isMobile) {
        cakeGroup.position.y = 0.5;
    }
    
    // Добавляем свечи
    const candles = [];
    
    for (let i = 0; i < 5; i++) {
        const candleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
        const candleMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        const candle = new THREE.Mesh(candleGeometry, candleMaterial);
        
        // Располагаем свечи по кругу
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.6;
        candle.position.x = Math.cos(angle) * radius;
        candle.position.z = Math.sin(angle) * radius;
        candle.position.y = -0.7;
        
        // Добавляем пламя свечи
        const flameGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const flameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff3300, 
            emissive: 0xff7700,
            emissiveIntensity: 1
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.y = 0.3;
        flame.scale.y = 1.5;
        candle.add(flame);
        
        cakeGroup.add(candle);
        candles.push({ candle, flame });
    }
    
    // Добавляем плавающие сердечки
    const hearts = [];
    const heartCount = isMobile ? 10 : 20; // Меньше сердечек для мобильных устройств
    
    for (let i = 0; i < heartCount; i++) {
        // Создаем форму сердца
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x, y);
        heartShape.bezierCurveTo(x + 0.1, y + 0.1, x + 0.2, y, x + 0.2, y - 0.15);
        heartShape.bezierCurveTo(x + 0.2, y - 0.3, x, y - 0.3, x, y - 0.15);
        heartShape.bezierCurveTo(x, y - 0.3, x - 0.2, y - 0.3, x - 0.2, y - 0.15);
        heartShape.bezierCurveTo(x - 0.2, y, x - 0.1, y + 0.1, x, y);
        
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
            steps: 1,
            depth: 0.05,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 3
        });
        
        // Случайный оттенок розового
        const hue = Math.random() * 0.1 + 0.9; // 0.9-1.0 (красный - розовый диапазон)
        const saturation = Math.random() * 0.2 + 0.8; // 0.8-1.0
        const lightness = Math.random() * 0.3 + 0.7; // 0.7-1.0
        
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        const heartMaterial = new THREE.MeshPhongMaterial({ color: color });
        
        const heart = new THREE.Mesh(heartGeometry, heartMaterial);
        heart.scale.set(0.2, 0.2, 0.2);
        
        // Случайное положение и скорость
        heart.position.x = Math.random() * 10 - 5;
        heart.position.y = Math.random() * 10 - 5;
        heart.position.z = Math.random() * 10 - 15;
        
        heart.rotation.x = Math.random() * Math.PI;
        heart.rotation.y = Math.random() * Math.PI;
        heart.rotation.z = Math.random() * Math.PI;
        
        const speed = {
            x: Math.random() * 0.01 - 0.005,
            y: Math.random() * 0.01 + 0.003,
            rotateZ: Math.random() * 0.02 - 0.01
        };
        
        hearts.push({ heart, speed });
        scene.add(heart);
    }
    
    // Добавляем пузырьки/шарики
    const bubbles = [];
    const bubbleCount = isMobile ? 8 : 15; // Меньше пузырьков для мобильных устройств
    
    for (let i = 0; i < bubbleCount; i++) {
        const radius = Math.random() * 0.2 + 0.1;
        const segments = 16;
        const bubbleGeometry = new THREE.SphereGeometry(radius, segments, segments);
        
        // Прозрачный материал с переливающимся эффектом
        const bubbleMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            shininess: 100,
            specular: 0xffffff
        });
        
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        // Случайное положение и скорость
        bubble.position.x = Math.random() * 10 - 5;
        bubble.position.y = Math.random() * 5 - 5;
        bubble.position.z = Math.random() * 10 - 15;
        
        const speed = {
            x: Math.random() * 0.01 - 0.005,
            y: Math.random() * 0.01 + 0.005,
            scale: Math.random() * 0.002 + 0.001
        };
        
        bubbles.push({ bubble, speed, scaleDir: 1 });
        scene.add(bubble);
    }
    
    // Добавляем OrbitControls для управления камерой
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    
    // Функция анимации
    function animate() {
        requestAnimationFrame(animate);
        
        // Анимация свечей
        candles.forEach(({ candle, flame }) => {
            // Колебание пламени
            flame.scale.y = 1.5 + Math.sin(Date.now() * 0.01) * 0.2;
            flame.position.x = Math.sin(Date.now() * 0.005) * 0.03;
        });
        
        // Анимация плавающих сердечек
        hearts.forEach(({ heart, speed }) => {
            heart.position.x += speed.x;
            heart.position.y += speed.y;
            heart.rotation.z += speed.rotateZ;
            
            // Возвращаем сердечки, если они улетели слишком далеко
            if (heart.position.y > 5) {
                heart.position.y = -5;
                heart.position.x = Math.random() * 10 - 5;
                heart.position.z = Math.random() * 10 - 15;
            }
        });
        
        // Анимация пузырьков
        bubbles.forEach(({ bubble, speed, scaleDir }) => {
            bubble.position.x += speed.x;
            bubble.position.y += speed.y;
            
            // Пульсация пузырьков
            const scaleChange = speed.scale * scaleDir;
            bubble.scale.x += scaleChange;
            bubble.scale.y += scaleChange;
            bubble.scale.z += scaleChange;
            
            // Меняем направление масштабирования при достижении пределов
            if (bubble.scale.x > 1.2 || bubble.scale.x < 0.8) {
                bubbles.scaleDir = -bubbles.scaleDir;
            }
            
            // Возвращаем пузырьки, если они улетели слишком далеко
            if (bubble.position.y > 5) {
                bubble.position.y = -5;
                bubble.position.x = Math.random() * 10 - 5;
                bubble.position.z = Math.random() * 10 - 15;
            }
        });
        
        // Медленное вращение торта
        cakeGroup.rotation.y += 0.005;
        
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 768;
        
        // Перенастраиваем камеру при изменении размера экрана
        if (isMobileNow) {
            camera.position.z = 7;
            camera.position.y = -1;
            cakeGroup.position.y = 0.5;
        } else {
            camera.position.z = 5;
            camera.position.y = 0;
            cakeGroup.position.y = 0;
        }
        
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Запускаем анимацию
    animate();
}

// Функция для создания конфетти
function initConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff85a2', '#ffc0d3', '#ffb5e8', '#fffd8c', '#a5ffeb', '#c4f0ff'];
    const confettiCount = window.innerWidth <= 768 ? 100 : 200; // Меньше конфетти для мобильных
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(confettiContainer, colors);
    }
    
    // Обработчик события для создания конфетти при клике
    document.addEventListener('click', function() {
        for (let i = 0; i < (window.innerWidth <= 768 ? 25 : 50); i++) {
            createConfetti(confettiContainer, colors);
        }
    });
}

function createConfetti(container, colors) {
    const confetti = document.createElement('div');
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 5 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.position = 'absolute';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.opacity = Math.random() + 0.5;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    // Настраиваем начальную позицию и анимацию
    confetti.style.top = '-5vh';
    confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
    
    // Длительность анимации падения
    const duration = Math.random() * 3 + 3;
    
    // Стили анимации
    confetti.style.animation = `fall ${duration}s linear forwards`;
    
    // Добавляем стиль для анимации падения, если его еще нет
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.innerHTML = `
            @keyframes fall {
                0% {
                    top: -5vh;
                    transform: rotate(0deg) translateX(0);
                }
                25% {
                    transform: rotate(${Math.random() * 360}deg) translateX(${Math.random() * 15 - 7.5}vw);
                }
                50% {
                    transform: rotate(${Math.random() * 360}deg) translateX(${Math.random() * 15 - 7.5}vw);
                }
                75% {
                    transform: rotate(${Math.random() * 360}deg) translateX(${Math.random() * 15 - 7.5}vw);
                }
                100% {
                    top: 105vh;
                    transform: rotate(${Math.random() * 360}deg) translateX(${Math.random() * 15 - 7.5}vw);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(confetti);
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
        confetti.remove();
    }, duration * 1000);
}

// Функция для инициализации таймера обратного отсчета
function initCountdown() {
    // Устанавливаем дату дня рождения (например, 1 января 2024)
    // Замените эту дату на реальную дату дня рождения Айши
    const birthdate = new Date('2024-01-01T00:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = birthdate - now;
        
        // Если день рождения уже наступил, ничего не показываем
        if (diff <= 0) {
            document.querySelector('.countdown').style.display = 'none';
            return;
        }
        
        // Расчет оставшегося времени
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Обновляем элементы таймера
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Обновляем таймер каждую секунду
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Функция для инициализации музыкального плеера
function initMusicPlayer() {
    const audio = document.getElementById('birthday-song');
    const playButton = document.getElementById('play-button');
    const progressBar = document.querySelector('.progress-bar');
    const playIcon = playButton.querySelector('i');
    
    // Флаг для отслеживания состояния воспроизведения
    let isPlaying = false;
    
    // Функция для проигрывания/паузы
    function togglePlay() {
        if (isPlaying) {
            audio.pause();
            playIcon.className = 'fas fa-play';
        } else {
            audio.play()
                .catch(error => {
                    console.error('Ошибка воспроизведения:', error);
                });
            playIcon.className = 'fas fa-pause';
            
            // Создаем больше конфетти при запуске музыки
            for (let i = 0; i < 100; i++) {
                createConfetti(document.getElementById('confetti-container'), 
                    ['#ff85a2', '#ffc0d3', '#ffb5e8', '#fffd8c', '#a5ffeb', '#c4f0ff']);
            }
        }
        isPlaying = !isPlaying;
    }
    
    // Обновление прогресс-бара
    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    }
    
    // Обработка клика на прогресс-бар
    function setProgress(e) {
        const progressContainer = this;
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }
    
    // Добавляем обработчики событий
    playButton.addEventListener('click', togglePlay);
    audio.addEventListener('timeupdate', updateProgress);
    document.querySelector('.progress-container').addEventListener('click', setProgress);
    
    // Обработчик окончания песни
    audio.addEventListener('ended', function() {
        playIcon.className = 'fas fa-play';
        isPlaying = false;
        progressBar.style.width = '0%';
        
        // Дополнительный эффект при окончании песни - большое количество конфетти
        for (let i = 0; i < 200; i++) {
            createConfetti(document.getElementById('confetti-container'), 
                ['#ff85a2', '#ffc0d3', '#ffb5e8', '#fffd8c', '#a5ffeb', '#c4f0ff']);
        }
    });
    
    // Наблюдение за скроллом, чтобы автоматически воспроизвести музыку, когда пользователь дойдет до плеера
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Если элемент видим и музыка еще не играет
            if (entry.isIntersecting && !isPlaying) {
                // Немного задержки для лучшего эффекта
                setTimeout(() => {
                    if (!isPlaying) {
                        togglePlay();
                    }
                }, 1000);
            }
        });
    }, { threshold: 0.7 }); // Элемент должен быть виден на 70%
    
    // Наблюдаем за музыкальным плеером
    observer.observe(document.querySelector('.music-player'));
} 