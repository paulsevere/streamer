const readLinks = () => JSON.parse(window.localStorage.getItem("visited"));

const ex = ext => str => _.includes(str, ext);

const extPredicate = str => _.overSome([ex(".wmv"), ex(".flv"), ex(".rar")]);

const mapLinks = links => {
  let link_status = readLinks();
  return links
    .filter(e => e.includes(".mp4"))
    .map(e => ({ href: e, visited: link_status.includes(e) }));
};
const renderLink = link => `<a id=${link.href} href="${link.href}" class="collection-item collection-link ${link.visited
  ? "visited"
  : ""}">
${link.href}
</a>`;

const renderLinks = links =>
  mapLinks(links)
    .map(renderLink)
    .join("");
const addLinks = (selector, links) => $(selector).html(links);

const setupLinks = (links = window._links) => {
  window._links = links;
  let links_html = renderLinks(links);
  addLinks("#files", links_html);
  addLinks("#visited", links_html);
};
const setLink = (link, e, toggle = true) => {
  let links = JSON.parse(window.localStorage.getItem("visited"));
  if (toggle) {
    links.push(link);
  } else if (!toggle) {
    let newLinks = _.without(links, link);
  }
  window.localStorage.setItem("visited", JSON.stringify(links));
  if (e.metaKey) {
    setupLinks();
  }
};

window.readLinks = readLinks;
window.setLink = setLink;

$(() => {
  if (window.localStorage && !window.localStorage.getItem("visited")) {
    window.localStorage.setItem("visited", JSON.stringify([]));
  }
  $("html").on("click", ".collection-link", e => {
    setLink(e.target.id, e);
  });
  $(".collection-link:visited").hide();
  fetch("/list")
    .then(res => res.json())
    .then(setupLinks)
    .catch(console.error);
});
