(() => {
  // src/js/dselect.js
  function dselectUpdate(button, classElement, classToggler) {
    const value = button.dataset.dselectValue;
    const target = button.closest(`.${classElement}`).previousElementSibling;
    const toggler = target.nextElementSibling.getElementsByClassName(classToggler)[0];
    const input = target.nextElementSibling.querySelector("input");
    if (target.multiple) {
      Array.from(target.options).filter((option) => option.value === value)[0].selected = true;
    } else {
      target.value = value;
    }
    if (target.multiple) {
      toggler.click();
    }
    target.dispatchEvent(new Event("change"));
    toggler.focus();
    if (input) {
      input.value = "";
    }
  }
  function dselectRemoveTag(button, classElement, classToggler) {
    const value = button.parentNode.dataset.dselectValue;
    const target = button.closest(`.${classElement}`).previousElementSibling;
    const toggler = target.nextElementSibling.getElementsByClassName(classToggler)[0];
    const input = target.nextElementSibling.querySelector("input");
    Array.from(target.options).filter((option) => option.value === value)[0].selected = false;
    target.dispatchEvent(new Event("change"));
    toggler.click();
    if (input) {
      input.value = "";
    }
  }
  function dselectSearch(event, input, classElement, classToggler, creatable, localization) {
    const filterValue = input.value.toLowerCase().trim();
    const itemsContainer = input.nextElementSibling;
    const headers = Array.from(itemsContainer.querySelectorAll(".dropdown-header"));
    const items = Array.from(itemsContainer.querySelectorAll(".dropdown-item"));
    const noResults = itemsContainer.nextElementSibling;
    headers.forEach((header) => header.classList.add("d-none"));
    items.forEach((item) => {
      const filterText = item.textContent.toLowerCase();
      const isVisible = filterText.includes(filterValue);
      item.classList.toggle("d-none", !isVisible);
      if (isVisible) {
        let currentHeader = item.previousElementSibling;
        while (currentHeader && !currentHeader.classList.contains("dropdown-header")) {
          currentHeader.classList.remove("d-none");
          currentHeader = currentHeader.previousElementSibling;
        }
      }
    });
    headers.forEach((header) => {
      const filterText = header.textContent.toLowerCase();
      const isVisible = filterText.includes(filterValue);
      header.classList.toggle("d-none", !isVisible);
      if (isVisible) {
        let currentItem = header.nextElementSibling;
        while (currentItem && !currentItem.classList.contains("dropdown-header")) {
          currentItem.classList.remove("d-none");
          currentItem = currentItem.nextElementSibling;
        }
      }
    });
    const foundItems = items.filter((item) => !item.classList.contains("d-none") && !item.hasAttribute("hidden"));
    if (foundItems.length === 0) {
      noResults.classList.remove("d-none");
      itemsContainer.classList.add("d-none");
      if (creatable) {
        noResults.innerHTML = localization.replace("[searched-term]", input.value);
        if (event.key === "Enter") {
          const target = input.closest(`.${classElement}`).previousElementSibling;
          const toggler = target.nextElementSibling.querySelector(`.${classToggler}`);
          target.insertAdjacentHTML("afterbegin", `<option value="${input.value}" selected>${input.value}</option>`);
          target.dispatchEvent(new Event("change"));
          input.value = "";
          input.dispatchEvent(new Event("keyup"));
          toggler.click();
          toggler.focus();
        }
      }
    } else {
      noResults.classList.add("d-none");
      itemsContainer.classList.remove("d-none");
    }
  }
  function dselectClear(button, classElement) {
    const target = button.closest(`.${classElement}`).previousElementSibling;
    Array.from(target.options).forEach((option) => option.selected = false);
    target.dispatchEvent(new Event("change"));
  }
  function dselect2(el, option = {}) {
    el.style.display = "none";
    const classElement = "dselect-wrapper";
    const classNoResults = "dselect-no-results";
    const classTagRemove = "dselect-tag-remove";
    const dselectClassTag = "dselect-tag";
    const classPlaceholder = "dselect-placeholder";
    const classClearBtn = "dselect-clear";
    const classTogglerClearable = "dselect-clearable";
    const defaultClassTag = `text-bg-dark bg-gradient`;
    const defaultSearch = false;
    const defaultCreatable = false;
    const defaultClearable = false;
    const defaultMaxHeight = "360px";
    const defaultSize = "";
    const defaultItemClass = "";
    const defaultSearchPlaceholder = "Search..";
    const defaultAddOptionPlaceholder = "Press Enter to add &quot;<strong>[searched-term]</strong>&quot;";
    const defaultNoResultsPlaceholder = "No results found";
    const search = attrBool("search") || option.search || defaultSearch;
    const creatable = attrBool("creatable") || option.creatable || defaultCreatable;
    const clearable = attrBool("clearable") || option.clearable || defaultClearable;
    const maxHeight = el.dataset.dselectMaxHeight || option.maxHeight || defaultMaxHeight;
    const classTagTemp = el.dataset.dselectClassTag || option.classTag || defaultClassTag;
    const classTag = `${dselectClassTag} ${classTagTemp}`;
    const searchPlaceholder = el.dataset.dselectSearchPlaceholder || option.searchPlaceholder || defaultSearchPlaceholder;
    const noResultsPlaceholder = el.dataset.dselectNoResultsPlaceholder || option.noResultsPlaceholder || defaultNoResultsPlaceholder;
    const addOptionPlaceholder = el.dataset.dselectAddOptionPlaceholder || option.addOptionPlaceholder || defaultAddOptionPlaceholder;
    const itemClass = el.dataset.dselectItemClass || option.ItemClass || defaultItemClass;
    const customSize = el.dataset.dselectSize || option.size || defaultSize;
    let size = customSize !== "" ? ` form-select-${customSize}` : "";
    const classToggler = `form-select${size}`;
    const searchInput = search ? `<input onkeydown="return event.key !== 'Enter'" onkeyup="dselectSearch(event, this, '${classElement}', '${classToggler}', ${creatable}, '${addOptionPlaceholder}')" type="text" class="form-control" placeholder="${searchPlaceholder}" autofocus>` : "";
    function attrBool(attr) {
      const attribute = `data-dselect-${attr}`;
      if (!el.hasAttribute(attribute))
        return null;
      const value = el.getAttribute(attribute);
      return value.toLowerCase() === "true";
    }
    function removePrev() {
      if (el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains(classElement)) {
        el.nextElementSibling.remove();
      }
    }
    function isPlaceholder(option2) {
      return option2.getAttribute("value") === "";
    }
    function selectedTag(options, multiple) {
      if (multiple) {
        const selectedOptions = Array.from(options).filter((option2) => option2.selected && !isPlaceholder(option2));
        const placeholderOption = Array.from(options).filter((option2) => isPlaceholder(option2));
        let tag = [];
        if (selectedOptions.length === 0) {
          const text = placeholderOption.length ? placeholderOption[0].textContent : "&nbsp;";
          tag.push(`<span class="${classPlaceholder}">${text}</span>`);
        } else {
          for (const option2 of selectedOptions) {
            tag.push(`
            <div class="${classTag}" data-dselect-value="${option2.value}">
              ${option2.text}
              <svg onclick="dselectRemoveTag(this, '${classElement}', '${classToggler}')" class="${classTagRemove}" width="14" height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
            </div>
          `);
          }
        }
        return tag.join("");
      } else {
        const selectedOption = options[options.selectedIndex];
        return isPlaceholder(selectedOption) ? `<span class="${classPlaceholder}">${selectedOption.innerHTML}</span>` : selectedOption.innerHTML;
      }
    }
    function selectedText(options) {
      const selectedOption = options[options.selectedIndex];
      return isPlaceholder(selectedOption) ? "" : selectedOption.textContent;
    }
    function itemTags(options) {
      let items = [];
      for (const option2 of options) {
        if (option2.tagName === "OPTGROUP") {
          items.push(`<h6 class="dropdown-header">${option2.getAttribute("label")}</h6>`);
        } else {
          const hidden = isPlaceholder(option2) ? " hidden" : "";
          const active = option2.selected ? " active" : "";
          const disabled = option2.selected ? " disabled" : "";
          const disabledvalue = option2.getAttribute("disabled");
          const btnClass = itemClass === "" ? "" : " " + itemClass;
          let disableitem = "";
          if (disabledvalue !== null) {
            disableitem = "disabled='true'";
          } else {
            disableitem = "";
          }
          const value = option2.value;
          let text = option2.textContent;
          if (option2.hasAttribute("data-dselect-img") && option2.getAttribute("data-dselect-img").trim() !== "") {
            const img = option2.getAttribute("data-dselect-img").trim();
            let imgSize = "1rem";
            if (customSize == "sm") {
              imgSize = ".7rem";
            } else if (customSize == "lg") {
              imgSize = "1.2rem";
            }
            text = `<span class="d-flex align-items-center">
            <img src="${img}" style="max-height:${imgSize}; width:auto;">
            <span class="ps-2">${text}</span>
          </span>`;
          }
          items.push(`<button${hidden} class="dropdown-item${active}${btnClass}"  ${disableitem} data-dselect-value="${value}" type="button" onclick="dselectUpdate(this, '${classElement}', '${classToggler}')" ${disabled}>
          ${text}
        </button>`);
        }
      }
      items = items.join("");
      return items;
    }
    function createDom() {
      const autoclose = el.multiple ? ' data-bs-auto-close="outside"' : "";
      const additionalClass = Array.from(el.classList).filter((className) => {
        return className !== "form-select" && className !== "form-select-sm" && className !== "form-select-lg";
      }).join(" ");
      const clearBtn = clearable && !el.multiple ? `
    <button type="button" class="btn ${classClearBtn}" title="Clear selection" onclick="dselectClear(this, '${classElement}')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
        <path d="M13 1L0.999999 13" stroke-width="2" stroke="currentColor"></path>
        <path d="M1 1L13 13" stroke-width="2" stroke="currentColor"></path>
      </svg>
    </button>
    ` : "";
      const template = `
    <div class="dropdown ${classElement} ${additionalClass}">
      <button class="${classToggler} ${!el.multiple && clearable ? classTogglerClearable : ""}" data-dselect-text="${!el.multiple && selectedText(el.options)}" type="button" data-bs-toggle="dropdown" aria-expanded="false"${autoclose}>
        ${selectedTag(el.options, el.multiple)}
      </button>
      <div class="dropdown-menu">
        <div class="d-flex flex-column">
          ${searchInput}
          <div class="dselect-items" style="max-height:${maxHeight};overflow:auto">
            ${itemTags(el.querySelectorAll("*"))}
          </div>
          <div class="${classNoResults} d-none">${noResultsPlaceholder}</div>
        </div>
      </div>
      ${clearBtn}
    </div>
    `;
      removePrev();
      el.insertAdjacentHTML("afterend", template);
      const dropdownElement = el.nextElementSibling;
      dropdownElement.addEventListener("shown.bs.dropdown", function() {
        const searchInput2 = this.querySelector('input[type="text"]');
        if (searchInput2) {
          searchInput2.focus();
        }
      });
    }
    createDom();
    function updateDom() {
      const dropdown = el.nextElementSibling;
      const toggler = dropdown.getElementsByClassName(classToggler)[0];
      const dSelectItems = dropdown.getElementsByClassName("dselect-items")[0];
      toggler.innerHTML = selectedTag(el.options, el.multiple);
      dSelectItems.innerHTML = itemTags(el.querySelectorAll("*"));
      if (!el.multiple) {
        toggler.dataset.dselectText = selectedText(el.options);
      }
    }
    el.addEventListener("change", updateDom);
  }
  if (typeof window !== "undefined") {
    window.dselectUpdate = dselectUpdate;
    window.dselectRemoveTag = dselectRemoveTag;
    window.dselectSearch = dselectSearch;
    window.dselectClear = dselectClear;
    window.dselect = dselect2;
  }

  // src/js/site.js
  function flatten(obj) {
    let result = "";
    function traverse(obj2) {
      if (Array.isArray(obj2)) {
        obj2.forEach((item) => traverse(item));
      } else if (typeof obj2 === "object") {
        for (let key2 in obj2) {
          traverse(obj2[key2]);
        }
      } else {
        result += obj2 + ",";
      }
    }
    traverse(obj);
    return result.slice(0, -1);
  }
  function createMsg(from, msg) {
    const container = document.createElement("div"), pic = document.createElement("div"), meta = document.createElement("div"), msgbox = document.createElement("div"), now = /* @__PURE__ */ new Date(), currentDateTime = now.toLocaleString();
    container.classList.add("d-flex");
    pic.classList.add("flex-shrink-0", "text-center");
    meta.classList.add("text-secondary", "border-top", "border-secondary", "text-right", "fs-6");
    meta.innerHTML = currentDateTime;
    if (from === "ai") {
      msgbox.classList.add("shadow", "flex-grow-1", "ms-3", "border", "rounded", "p-2", "mb-2", "ai-chat", "bg-body-tertiary");
      pic.classList.add("order-0");
      pic.innerHTML = `<img src="/assets/svg/ai-6e9dd4.svg" alt="ai" style="max-width:75px; height:auto;">`;
    } else {
      msgbox.classList.add("shadow", "flex-grow-1", "me-3", "border", "rounded", "p-2", "mb-2", "user-chat", "bg-secondary-subtle");
      pic.classList.add("order-1");
      pic.innerHTML = `<img src="/assets/svg/me-639dd4.svg" alt="ai" style="max-width:75px; height:auto;">`;
    }
    msgbox.innerHTML = msg;
    msgbox.append(meta);
    container.append(pic);
    container.append(msgbox);
    return container;
  }
  async function loadSelects(promptSelect, modelSelect) {
    let selects = [];
    selects["prompt"] = await loadPrompts(promptSelect);
    selects["model"] = await loadModels(modelSelect);
    return selects;
  }
  var loadedPrompts = {
    "Advanced Coding Guru": "You are an advanced expert guru at all coding capabilities. While enforcing the use of tabs for indentation, you have a strong abbility to ensure the code you're writing is up to date with the newest versions of all languages, and using the newest features, and ensuring that the code you write is up to the standards for 2024 satisfaction. If you're unsure of any features, you will ask prior to writing the code."
  };
  async function loadPrompts(selectPrompt) {
    const response = await fetch("assets/data/prompts.json");
    const data = await response.json();
    console.log("prompts");
    console.log(data);
    Object.entries(await data).forEach(([key2, value]) => {
      const option = document.createElement("option");
      option.value = key2;
      option.text = key2;
      selectPrompt.appendChild(option);
      loadedPrompts[key2] = value;
    });
    dselect(selectPrompt);
    return selectPrompt;
  }
  var loadedModels = {};
  async function loadModels(selectModel) {
    const response = await fetch("assets/data/models.json");
    const data = await response.json();
    Object.entries(data).forEach(([key2, value]) => {
      const option = document.createElement("option");
      option.value = key2;
      option.text = value.name;
      option.setAttribute("data-dselect-img", value.img);
      selectModel.appendChild(option);
      loadedModels[key2] = value;
    });
    dselect(selectModel);
    return selectModel;
  }
  document.addEventListener("DOMContentLoaded", function() {
    const chatForm = document.getElementById("chat-form"), textarea = document.getElementById("chatMsg"), resp = document.getElementById("resp"), chatBox = document.getElementById("chat-box"), loading = document.getElementById("loading-icon"), promptSelect = document.getElementById("prompt-preset-select"), systemPrompt = document.getElementById("systemPrompt"), modelSelect = document.getElementById("model-preset-select"), modelLabel = document.getElementById("type-model");
    let sidePanel = document.getElementById("sidePanel"), settingsBtn = document.getElementById("settings-btn"), toDoList = document.getElementById("to-do-list"), toDoBtn = document.getElementById("to-do-btn"), mainChat = document.getElementById("main-chat");
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let chatMsg = textarea.value;
      loading.classList.remove("d-none");
      const userChat = marked.parse(chatMsg);
      const userDiv = createMsg("user", userChat);
      chatBox.insertBefore(userDiv, resp);
      const formData = new FormData();
      formData.append("model", modelSelect.value);
      formData.append("prompt", systemPrompt.value);
      const plainObject = Object.fromEntries(formData);
      try {
        const response = await fetch("/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(plainObject)
        });
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        textarea.value = "";
        const tevent = new Event("input", { bubbles: true });
        textarea.dispatchEvent(tevent);
        const result = await response.json();
        console.log(JSON.stringify(result));
        const atChat = marked.parse(result.aiResp);
        const aiDiv = createMsg("ai", atChat);
        chatBox.insertBefore(aiDiv, resp);
        chatBox.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightElement(block);
        });
        loading.classList.add("d-none");
      } catch (error) {
        console.error("Error:", error);
      }
    });
    loadSelects(promptSelect, modelSelect);
    promptSelect.addEventListener("change", async (e) => {
      systemPrompt.value = loadedPrompts[e.target.value];
    });
    modelSelect.addEventListener("change", async (e) => {
      modelLabel.innerHTML = `<img src="${loadedModels[key].img}" alt="Model">`;
    });
    textarea.addEventListener("input", function() {
      this.style.height = "auto";
      const newHeight = Math.min(this.scrollHeight, window.innerHeight * 0.4);
      this.style.height = newHeight + "px";
    });
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
    function mainCol(direction) {
      let curCol = parseInt(mainChat.getAttribute("data-yo-col"));
      let newCol = direction == "up" ? curCol + 3 : curCol - 3;
      mainChat.classList.remove("col-" + curCol);
      mainChat.classList.add("col-" + newCol);
      mainChat.setAttribute("data-yo-col", newCol);
    }
    sidePanel.addEventListener("show.bs.collapse", (event) => {
      settingsBtn.classList.toggle("btn-primary");
      settingsBtn.classList.toggle("btn-outline-primary");
      sidePanel.classList.toggle("font-zero");
      mainCol("down");
    });
    sidePanel.addEventListener("hide.bs.collapse", (event) => {
      settingsBtn.classList.toggle("btn-primary");
      settingsBtn.classList.toggle("btn-outline-primary");
      sidePanel.classList.toggle("font-zero");
      mainCol("up");
    });
    toDoList.addEventListener("show.bs.collapse", (event) => {
      toDoBtn.classList.toggle("btn-primary");
      toDoBtn.classList.toggle("btn-outline-primary");
      toDoBtn.classList.toggle("font-zero");
      mainCol("down");
    });
    toDoList.addEventListener("hide.bs.collapse", (event) => {
      toDoBtn.classList.toggle("btn-primary");
      toDoBtn.classList.toggle("btn-outline-primary");
      toDoBtn.classList.toggle("font-zero");
      mainCol("up");
    });
    document.getElementById("bgColor").addEventListener("input", function() {
      document.body.style.backgroundColor = this.value;
    });
    let gsColor = document.getElementById("gradientStart");
    let geColor = document.getElementById("gradientEnd");
    let opacityInput = document.getElementById("gradientOpacity");
    gsColor.addEventListener("input", updateGradient);
    geColor.addEventListener("input", updateGradient);
    opacityInput.addEventListener("input", updateGradient);
    function updateGradient() {
      const startColor = gsColor.value;
      const endColor = geColor.value;
      const opacity = opacityInput.value;
      document.body.style.backgroundImage = `linear-gradient(to right, ${hexToRgba(
        startColor,
        opacity
      )}, ${hexToRgba(endColor, opacity)})`;
    }
    function hexToRgba(hex, opacity) {
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  });
})();
//!-------------------------------------------------------------------!
//!
//!------------------------------------------------------------------------!
//# sourceMappingURL=app.js.map
