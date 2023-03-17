let tree =
{
    name: "Marv1",
    age: 23,
    variants: ["Zombie-A"],
    alive: true,
    children: [
        {
            name: "Loic",
            age: 25,
            variants: [],
            alive: true,
            children: [
                {
                    name: "Emma",
                    age: 22,
                    variants: [],
                    alive: true,
                    children: [
                        {
                            name: "Quentin",
                            age: 33,
                            variants: ["Zombie-B"],
                            alive: true,
                            children: []
                        }
                    ]
                },
                {
                    name: "Noah",
                    age: 45,
                    variants: [],
                    alive: true,
                    children: []
                }
            ]
        },
        {
            name: "Antoine",
            age: 28,
            variants: ["Zombie-C"],
            alive: true,
            children: [
                {
                    name: "Tania",
                    age: 24,
                    variants: [],
                    alive: true,
                    children: []
                },
                {
                    name: "Pierre",
                    age: 26,
                    variants: [],
                    alive: true,
                    children: [
                        {
                            name: "Nathalie",
                            age: 24,
                            variants: [],
                            alive: true,
                            children: []
                        }
                    ]
                }
            ]
        }
    ]
};

function mapParentInChildren(node, parent) {
    node.children.forEach((children) => mapParentInChildren(children, node));
    node.parent = parent;
    return node;
}
function removeParentInChildren(node) {
    node.children.forEach((children) => removeParentInChildren(children));
    delete node.parent;
    return node;
}
tree = mapParentInChildren(tree, null);



function infectToptoBottom(node, variant, conditionFn) {
    if ((conditionFn === undefined || conditionFn(node) === true) && node.variants.includes(variant) === false) {
        node.variants.push(variant);
    }

    node.children.forEach((children) => infectToptoBottom(children, variant, conditionFn))

    return node;
}

function infectBottomToTop(node, variant, conditionFn) {
    if ((conditionFn === undefined || conditionFn(node) === true) && node.variants.includes(variant) === false) {
        node.variants.push(variant);
    }

    if (node.parent !== null) {
        infectBottomToTop(node.parent, variant, conditionFn);
    }

    return node;
}

function infectAlternate(node, variant) {
    node.children.forEach((children, index) => {
        if (index % 2 === 0 && children.variants.includes(variant) === false) {
            children.variants.push(variant);
        }

        return children;
    });
    
    return node;
}

function vaccinA1(node){
    if (node.age <= 30 ) {
        node.variants = node.variants.filter(word => word != 'Zombie-A');
        node.variants = node.variants.filter(word => word != 'Zombie-32');
        return node;
    }
    return node;
}

function vaccinB1(node){
    if (!node.alive)
    {
        return node;
    }
    if(Math.random() <= 0.5){
        node.alive = false;
        return node;
    }
    node.variants = node.variants.filter(word => word != 'Zombie-B');
    node.variants = node.variants.filter(word => word != 'Zombie-C');
    return node;
}

function vaccinUlt(node){
    node.variants = node.variants.filter(word => word != 'Zombie-Ultime');
    return node;
}

function pandemie(node) {
    node.variants.forEach((variant) => {
        switch (variant) {
            case 'Zombie-A':
                node = infectToptoBottom(node, 'Zombie-A');
                break;
            case 'Zombie-B':
                node = infectBottomToTop(node, 'Zombie-B');
                break;
            case 'Zombie-32':
                node = infectToptoBottom(node, 'Zombie-32', (node) => node.age >= 32);
                node = infectBottomToTop(node, 'Zombie-32', (node) => node.age >= 32);
                break;
            case 'Zombie-C':
                node = infectAlternate(node, 'Zombie-C');
                break;
            case 'Zombie-Ultime':
                node = infectBottomToTop(node, 'Zombie-Ultime', (node) => node.parent === null);
                break;
        }
    });

    node.children.map((children) => pandemie(children, node));
    
    return node;
}

function vaccine(node){
    node.variants.forEach((variant) => {
                switch (variant) {
            case 'Zombie-A':
                node = vaccinA1(node);
                break;
            case 'Zombie-B':
                node = vaccinB1(node);
                break;
            case 'Zombie-32':
                node = vaccinA1(node);
                break;
            case 'Zombie-C':
                node = vaccinB1(node);
                break;
            case 'Zombie-Ultime':
                node = vaccinUlt(node);
                break;
        }
    });
    node.children.map((children) => vaccine(children, node));

    return node;
}

tree = pandemie(tree);

tree = vaccine(tree);

tree = removeParentInChildren(tree);

console.dir(tree, { depth: null });
