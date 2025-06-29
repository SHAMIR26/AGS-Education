
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menuIcon');
    const sideNav = document.getElementById('sideNav');
    const closeNav = document.getElementById('closeNav');
    menuIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        sideNav.classList.add('open');
    });
    closeNav.addEventListener('click', function() {
        sideNav.classList.remove('open');
    });
    document.addEventListener('click', function(e) {
        if (!sideNav.contains(e.target) && !menuIcon.contains(e.target)) {
            sideNav.classList.remove('open');
        }
    });
});