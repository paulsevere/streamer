const renderLink = link => `<a id=${link} href="${link}" class="video-link">
${link}
</a>`;
const renderLinks = links => links.map(renderLink).join("");
const addLinks = links => $(".files").html(renderLinks(links));

$(() => {
  //   $("html").on("click", ".video-link", e => {
  //     fetch(`/video/${e.target.id}`);
  //   });
  fetch("/list")
    .then(res => res.json())
    .then(addLinks)
    .catch(console.error);
});
