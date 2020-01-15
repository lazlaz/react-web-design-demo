class DragUtil {
   static addDrag = () => {
    console.log($(".hk-design-drager"));

    $(".hk-design-container").sortable({
      opacity: 0.35,
      connectWith: ".hk-design-container"
    });

    $(".hk-design-drager").draggable({
      connectToSortable: ".hk-design-container",
      helper: "clone",
      drag: function(e, t) {},
      stop: function(e, t) {}
    });
  };
}

export default DragUtil;
