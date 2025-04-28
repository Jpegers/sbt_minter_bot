const formState = {
    title: '',
    description: '',
    mainPhoto: null,
    sbtPhoto: null,
    wallets: [],
  };
  
  let currentScreen = 1;
  
// Переход между экранами
function goToScreen(n) {
  // Если это экран 2 — подставляем сохранённые значения
  if (n === 2) {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    if (title && description) {
      title.value = formState.title || '';
      description.value = formState.description || '';
    }
  }

  function updateProgressBar(step) {
    const steps = 7; // всего 7 экранов
    const progress = ((step - 1) / (steps - 1)) * 100;
    const indicator = document.getElementById('progress-indicator');
    if (indicator) {
      indicator.style.width = `${progress}%`;
    }
  }
  

  // Скрываем все экраны
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('active');
  });

  // Показываем нужный
  const next = document.getElementById(`screen-${n}`);
  if (next) {
    next.classList.remove('hidden');
    next.classList.add('active');
    currentScreen = n;
    updateProgressBar(n);
  } else {
    console.warn(`Screen screen-${n} not found`);
  }
}

  
  // Валидация названия и описания
  function validateStep2() {
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const titleHint = document.getElementById('title-hint');
    const descHint = document.getElementById('desc-hint');
  
    let valid = true;
  
    if (title.value.trim().length < 2) {
      title.classList.add('error');
      titleHint.textContent = 'The name must be at least 2 characters long.';
      titleHint.classList.add('error-msg');
      valid = false;
    } else {
      title.classList.remove('error');
      titleHint.textContent = 'Minimum 2 characters';
      titleHint.classList.remove('error-msg');
    }
  
    if (description.value.trim().length > 255) {
      description.classList.add('error');
      descHint.textContent = 'The description must not exceed 255 characters.';
      descHint.classList.add('error-msg');
      valid = false;
    } else {
      description.classList.remove('error');
      descHint.textContent = 'Maximum 255 characters';
      descHint.classList.remove('error-msg');
    }
  
    if (valid) {
      formState.title = title.value.trim();
      formState.description = description.value.trim();
      goToScreen(3);
    }
  }
  
  // Инициализация первого экрана при загрузке
  window.addEventListener('load', () => {
    goToScreen(1);
  });

  
  // ---------- ШАГИ 3–5: Фото и кошельки ----------

function validateStep3() {
    const file = document.getElementById('main-photo').files[0];
    if (!file) {
      alert('Please upload the main photo.');
      return;
    }
    formState.mainPhoto = file;
    goToScreen(4);
  }
  
  function validateStep4() {
    const file = document.getElementById('sbt-photo').files[0];
    if (!file) {
      alert('Please upload an image for SBT.');
      return;
    }
    formState.sbtPhoto = file;
    goToScreen(5);
  }

  function removeMainPhoto() {
    formState.mainPhoto = null;
  
    document.getElementById('main-photo').value = '';
    document.getElementById('main-photo-preview').classList.add('hidden');
    document.getElementById('main-photo-remove').classList.add('hidden');
    document.getElementById('main-photo-status').textContent = 'File not uploaded';
    document.getElementById('main-photo-status').className = 'file-status';
  }
  
  function removeSbtPhoto() {
    formState.sbtPhoto = null;
  
    document.getElementById('sbt-photo').value = '';
    document.getElementById('sbt-photo-preview').classList.add('hidden');
    document.getElementById('sbt-photo-remove').classList.add('hidden');
    document.getElementById('sbt-photo-status').textContent = 'File not uploaded';
    document.getElementById('sbt-photo-status').className = 'file-status';
  }

  document.getElementById('sbt-photo').addEventListener('change', function () {
    const file = this.files[0];
    const status = document.getElementById('sbt-photo-status');
    const preview = document.getElementById('sbt-photo-preview');
    const removeBtn = document.getElementById('sbt-photo-remove');
  
    if (!file) return;
  
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      status.textContent = 'Invalid format. Only JPG or PNG.';
      status.className = 'file-status error';
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      status.textContent = 'File too large. Up to 5 MB.';
      status.className = 'file-status error';
      return;
    }
  
    formState.sbtPhoto = file;
  
    status.textContent = 'File uploaded successfully';
    status.className = 'file-status ok';
  
    preview.src = URL.createObjectURL(file);
    preview.classList.remove('hidden');
    removeBtn.classList.remove('hidden');
  });
  
  
  
  function validateStep5() {
    if (formState.wallets.length === 0) {
      alert('Please add at least one wallet.');
      return;
    }
  
    updatePreview();
    goToScreen(6);
  }

  function updatePreview() {
    // Title
    document.getElementById('summary-title').textContent = formState.title;
  
    // Description
    const descBlock = document.getElementById('summary-desc');
    if (formState.description) {
      descBlock.textContent = formState.description;
      descBlock.classList.remove('hidden');
    } else {
      descBlock.classList.add('hidden');
    }
  
    // Main image
    const mainPreview = document.getElementById('summary-main-photo');
    if (formState.mainPhoto) {
      const url = URL.createObjectURL(formState.mainPhoto);
      mainPreview.src = url;
      mainPreview.classList.remove('hidden');
      mainPreview.onload = () => URL.revokeObjectURL(url);
    } else {
      mainPreview.classList.add('hidden');
    }
  
    // SBT image
    const sbtPreview = document.getElementById('summary-sbt');
    if (formState.sbtPhoto) {
      const url = URL.createObjectURL(formState.sbtPhoto);
      sbtPreview.src = url;
      sbtPreview.classList.remove('hidden');
      sbtPreview.onload = () => URL.revokeObjectURL(url);
    } else {
      sbtPreview.classList.add('hidden');
    }
  }
  
  
  
  
  function addWalletManually() {
    const input = document.getElementById('wallet-input');
    const address = input.value.trim();
  
    if (!isValidTonWallet(address)) {
      alert('Invalid TON wallet format.');
      return;
    }
  
    if (!formState.wallets.includes(address)) {
      formState.wallets.push(address);
      input.value = '';
      updateWalletList();
    } else {
      alert('This wallet has already been added.');
    }
  }
  
  function updateWalletList() {
    const list = document.getElementById('wallet-list');
    list.innerHTML = '';
  
    formState.wallets.forEach((wallet, index) => {
      const li = document.createElement('li');
      li.className = 'wallet-item';
      li.innerHTML = `
        <span class="wallet-address">${wallet}</span>
        <button class="wallet-remove" onclick="removeWallet(${index})">✖</button>
      `;
      list.appendChild(li);
    });
  }
  
  function removeWallet(index) {
    formState.wallets.splice(index, 1);
    updateWalletList();
  }
  
  function isValidTonWallet(address) {
    const base64Regex = /^[A-Za-z0-9_\-]{48,60}$/;
    const hexRegex = /^[0-9a-fA-F]{64}$/;
    return base64Regex.test(address) || hexRegex.test(address);
  }
  
  // CSV загрузка
  const csvInput = document.getElementById('wallet-csv');
  if (csvInput) {
    csvInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = function (event) {
        const lines = event.target.result.split(/\r?\n/);
        let count = 0;
  
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.length > 4 && !formState.wallets.includes(trimmed)) {
            formState.wallets.push(trimmed);
            count++;
          }
        });
  
        if (count > 0) {
          updateWalletList();
          alert(`Added ${count} wallets from CSV`);
        } else {
          alert('Failed to add wallets from CSV. Make sure there are valid lines.');
        }
  
        e.target.value = '';
      };
  
      reader.readAsText(file);
    });
  }

  // ---------- ШАГИ 6–7: Итог и завершение ----------

  function mint() {
    if (!formState.title || !formState.mainPhoto || !formState.sbtPhoto || formState.wallets.length === 0) {
      alert('Please make sure all details are filled in.');
      return;
    }
  
    goToScreen(6);
  
    // Название и описание
    const titleEl = document.getElementById('summary-title');
    const summaryDesc = document.getElementById('summary-desc');
    if (formState.description.trim()) {
      summaryDesc.textContent = formState.description;
      summaryDesc.classList.remove('hidden');
    } else {
      summaryDesc.classList.add('hidden');
    }
    
  
    titleEl.textContent = formState.title || '';

  
    // Главное изображение
    const mainPreview = document.getElementById('summary-main-photo');
    if (formState.mainPhoto) {
      const url = URL.createObjectURL(formState.mainPhoto);
      mainPreview.src = url;
      mainPreview.classList.remove('hidden');
      mainPreview.onload = () => URL.revokeObjectURL(url);
    } else {
      mainPreview.src = '';
      mainPreview.classList.add('hidden');
    }
  
    // SBT изображение
    const sbtPreview = document.getElementById('summary-sbt');
    if (formState.sbtPhoto) {
      const url = URL.createObjectURL(formState.sbtPhoto);
      sbtPreview.src = url;
      sbtPreview.classList.remove('hidden');
      sbtPreview.onload = () => URL.revokeObjectURL(url);
    } else {
      sbtPreview.src = '';
      sbtPreview.classList.add('hidden');
    }
  }
  
  
  
  function openWalletModal() {
    const modal = document.getElementById('wallet-modal');
    const list = document.getElementById('wallet-modal-list');
    list.innerHTML = '';
  
    formState.wallets.forEach(wallet => {
      const li = document.createElement('li');
      li.textContent = wallet;
      list.appendChild(li);
    });
  
    modal.classList.remove('hidden');
  
    // Добавим закрытие по клику вне модального окна
    modal.addEventListener('click', function handleOutsideClick(e) {
      if (e.target === modal) {
        closeWalletModal();
        modal.removeEventListener('click', handleOutsideClick);
      }
    });
  }
  
  
  
  function closeWalletModal() {
    document.getElementById('wallet-modal').classList.add('hidden');
  }
  
// Обработка загрузки главного фото
document.getElementById('main-photo').addEventListener('change', function () {
    const file = this.files[0];
    const status = document.getElementById('main-photo-status');
    const preview = document.getElementById('main-photo-preview');
    const removeBtn = document.getElementById('main-photo-remove');
  
    if (!file) return;
  
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      status.textContent = 'Invalid format. Only JPG or PNG.';
      status.className = 'file-status error';
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      status.textContent = 'File too large. Up to 5 MB.';
      status.className = 'file-status error';
      return;
    }
  
    const img = new Image();
    img.onload = function () {
      if (!isAlmostSquare(img.width, img.height)) {
        status.textContent = 'The image should be almost square.';
        status.className = 'file-status error';
        return;
      }
  
      // УСПЕШНАЯ ЗАГРУЗКА
      status.textContent = 'File uploaded successfully';
      status.className = 'file-status ok';
  
      preview.src = URL.createObjectURL(file);
      preview.classList.remove('hidden');
      removeBtn.classList.remove('hidden');
  
      formState.mainPhoto = file;
    };
  
    img.onerror = function () {
      status.textContent = 'Error loading image';
      status.className = 'file-status error';
    };
  
    img.src = URL.createObjectURL(file);
  });
  
  // Проверка квадрата
  function isAlmostSquare(width, height) {
    const ratio = width / height;
    return ratio > 0.8 && ratio < 1.25;
  }
  

  function exitApp() {
    if (window.Telegram && Telegram.WebApp) {
      Telegram.WebApp.close();
    } else {
      alert('Exit');
    }
  }


  // выход из проложения по кнопке
  document.getElementById('exit-btn').addEventListener('click', () => {
    if (window.Telegram && Telegram.WebApp) {
      Telegram.WebApp.close();
    } else {
      console.warn('Telegram.WebApp API not available');
    }
  });
  
  