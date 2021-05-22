
class BulletEntry extends HTMLElement {
    constructor() {
      super();
  
      const template = document.createElement('template');
  
      template.innerHTML = `
          <style>

            .bullet-entry .bullet{
                display: flex;
                align-items: center;
                height: 2em;
                font-size: 1.4em;
                background-color: antiquewhite;
                border-width: 0.5px;
                border-style: solid;
                border-radius: 0.5em;  
                margin:0.3rem;
                text-align: left;
                padding-left: 0.5rem;
            
            }
            
            .bullet-entry .bullet-button {
                margin: 0.5rem;
                line-height: 1rem;
                font-size: 1rem;
                background-color: aquamarine;
            }
            
            .bullet-entry .title {
                text-align: center;
                width: 90%;
            }
            .bullet-entry .des{
                overflow:expand;
                display:none;
                align-items: center;
                height: auto;

                background-color: rgb(136, 123, 105);
                font-size: 0.9em;
                border-width: 0.5px;
                border-style: solid;
                border-radius: 0.5em;  
                margin:0.5rem;
                text-align: center;
                padding: 0.5rem;
            }
            .bullet-entry .date{
                display:none;
            }
            .bullet-entry .category{
                display:none;
            }
            .bullet-entry .type{
                display:none;
            }
            .bullet-entry .completedCheck{
                display:none;
            }
          </style>
          <section class="bullet-entry">
            <div class="bullet">
                <input class="checkbox" type="checkbox">
                <span class="title">demo</span>
                <button class="bullet-button edit-bullet-button">edit</button>
                <button class="bullet-button bullet-detail-button">detail</button>
                <span class="date">demo</span>
                <span class="category">demo</span>
                <span class="type">demo</span>

            </div>
            <div class="des">
            </div>
          </section>
          `;
  
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  
    get bullet() {
      let entryObj = {
        'title': this.shadowRoot.querySelector('.title').innerText,
        'checked': this.shadowRoot.querySelector('.checkbox').checked,
        'description': this.shadowRoot.querySelector('.des').innerText,
        'date': this.shadowRoot.querySelector('.date').innerText,
        'category': this.shadowRoot.querySelector('.category').innerText,
        'type': this.shadowRoot.querySelector('.type').innerText,
      };
      return entryObj;
    }
  
    set bullet(newBullet) {
      this.shadowRoot.querySelector('.title').innerText =newBullet.title;
      this.shadowRoot.querySelector('.checkbox').checked = newBullet.checked;
      this.shadowRoot.querySelector('.des').innerText = newBullet.description;
      this.shadowRoot.querySelector('.date').innerText = newBullet.date;
      this.shadowRoot.querySelector('.category').innerText = newBullet.category;
      this.shadowRoot.querySelector('.type').innerText = newBullet.type;

    }



  
  }
  
  customElements.define('bullet-entry', BulletEntry);
  
  /**
   * JSON Format:
   * image and audio will only sometimes be there
   *
   * {
   *   title: 'foo',
   *   date: 'foo',
   *   content: 'foo',
   *   image: {
   *     src: 'foo.com/bar.jpg',
   *     alt: 'foo'
   *   },
   *   audio: 'foo.com/bar.mp3'
   * }
   */
  