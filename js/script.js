const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

const bookedDates = [];
const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00"
];

const getBookedTimes = () => {
    try {
        return JSON.parse(localStorage.getItem("bookedTimes") || "{}");
    } catch {
        return {};
    }
};

const setBookedTimes = (data) => {
    localStorage.setItem("bookedTimes", JSON.stringify(data));
};

const updateTimeOptions = (dateValue) => {
    const timeSelect = document.getElementById("hora");
    if (!timeSelect) return;

    const booked = getBookedTimes();
    const usedTimes = new Set(booked[dateValue] || []);

    timeSelect.innerHTML = "<option value=\"\">Selecione um horário</option>";
    timeSlots.forEach((time) => {
        if (!usedTimes.has(time)) {
            const option = document.createElement("option");
            option.textContent = time;
            option.value = time;
            timeSelect.appendChild(option);
        }
    });
};

document.querySelectorAll("form[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nome = form.querySelector("[name='nome']")?.value || "";
        const telefone = form.querySelector("[name='telefone']")?.value || "";
        const servico = form.querySelector("[name='servico']")?.value || "";
        const data = form.querySelector("[name='data']")?.value || "";
        const hora = form.querySelector("[name='hora']")?.value || "";
        const observacoes = form.querySelector("[name='observacoes']")?.value || "";

        if (data && hora) {
            const booked = getBookedTimes();
            booked[data] = booked[data] || [];
            if (!booked[data].includes(hora)) {
                booked[data].push(hora);
                setBookedTimes(booked);
            }
            updateTimeOptions(data);
        }

        const mensagem = [
            "Novo agendamento:",
            `Nome: ${nome}`,
            `WhatsApp: ${telefone}`,
            `Serviço: ${servico}`,
            `Data: ${data}`,
            `Hora: ${hora}`,
            observacoes ? `Observações: ${observacoes}` : ""
        ].filter(Boolean).join("\n");

        const url = `https://wa.me/353832071184?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");

        form.reset();
    });
});

if (window.flatpickr) {
    flatpickr(".date-picker", {
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: bookedDates,
        locale: "pt",
        onChange: (selectedDates, dateStr) => updateTimeOptions(dateStr)
    });
} else {
    document.querySelectorAll(".date-picker").forEach((input) => {
        input.setAttribute("type", "date");
        input.setAttribute("min", new Date().toISOString().split("T")[0]);
        input.addEventListener("change", (event) => updateTimeOptions(event.target.value));
    });
}

const dateInput = document.querySelector(".date-picker");
if (dateInput?.value) {
    updateTimeOptions(dateInput.value);
}
