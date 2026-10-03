(function(){
  var slug = new URLSearchParams(location.search).get('novel');
  var key = 'novel-progress-' + slug;
  var story = document.getElementById('story'), choices = document.getElementById('choices');
  var endEl = document.getElementById('end'), titleEl = document.getElementById('title');
  var novel, history = [];

  function save(){ try{ localStorage.setItem(key, JSON.stringify(history)); }catch(e){} }
  function load(){ try{ return JSON.parse(localStorage.getItem(key)) || []; }catch(e){ return []; } }

  function render(){
    var id = history[history.length-1], p = novel.passages[id];
    story.innerHTML = ''; choices.innerHTML = ''; endEl.hidden = true;
    if(!p){ story.textContent = 'Missing passage: ' + id; return; }
    p.text.forEach(function(para){ var e = document.createElement('p'); e.textContent = para; story.appendChild(e); });
    if(p.choices && p.choices.length){
      p.choices.forEach(function(c){
        var b = document.createElement('button'); b.className = 'btn'; b.textContent = c.text;
        b.onclick = function(){ history.push(c.to); save(); render(); window.scrollTo(0,0); };
        choices.appendChild(b);
      });
    } else { endEl.hidden = false; }
    document.getElementById('back').disabled = history.length < 2;
  }

  document.getElementById('back').onclick = function(){ if(history.length>1){ history.pop(); save(); render(); } };
  document.getElementById('restart').onclick = function(){ history = [novel.start]; save(); render(); };

  if(!/^[a-z0-9-]+$/i.test(slug || '')){ titleEl.textContent = 'Novel not found'; return; }
  var s = document.createElement('script');
  s.src = 'novels/' + slug + '.js';
  s.onload = function(){
    novel = window.NOVELS && window.NOVELS[slug];
    if(!novel){ titleEl.textContent = 'Novel not found'; return; }
    document.title = novel.title;
    titleEl.textContent = novel.title;
    history = load(); if(!history.length) history = [novel.start];
    render();
  };
  s.onerror = function(){ titleEl.textContent = 'Novel not found'; };
  document.head.appendChild(s);
})();
