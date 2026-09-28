"""
Application pédagogique : EVPI, EVSI et ENBS
Module : Finance verte / décision d'investissement sous incertitude

Objectifs :
1. Comparer plusieurs projets verts sous incertitude.
2. Calculer la valeur attendue avec l'information actuelle.
3. Calculer l'EVPI (Expected Value of Perfect Information).
4. Simuler l'EVSI (Expected Value of Sample Information) pour plusieurs tailles d'échantillon.
5. Calculer l'ENBS = EVSI - coût de l'étude.
6. Identifier une taille d'étude économiquement intéressante.

Dépendances :
    pip install numpy pandas matplotlib scipy

Le script fonctionne dans Jupyter, Google Colab ou comme fichier .py.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import norm

SEED = 2026
rng = np.random.default_rng(SEED)
N_MC = 100_000

PROJECTS = ["Efficacité énergétique", "Solaire PV", "Gestion de l'eau"]

BASE_NET = {
    "Efficacité énergétique": 180_000,
    "Solaire PV": 150_000,
    "Gestion de l'eau": 120_000,
}

mu0 = 1.0
sigma0 = 0.30

BETA = {
    "Efficacité énergétique": 130_000,
    "Solaire PV": 180_000,
    "Gestion de l'eau": 230_000,
}

theta_ref = 1.0
sigma_y = 0.80
study_fixed_cost = 15_000
study_cost_per_obs = 450
sample_sizes = [10, 25, 50, 100, 200, 400, 800, 1200]

def project_net_benefit(project, theta):
    return BASE_NET[project] + BETA[project] * (theta - theta_ref)

def expected_net_benefits(prior_mean):
    return {p: project_net_benefit(p, prior_mean) for p in PROJECTS}

def best_project_from_mean(theta_mean):
    values = expected_net_benefits(theta_mean)
    best = max(values, key=values.get)
    return best, values[best]

current_values = expected_net_benefits(mu0)
current_best_project = max(current_values, key=current_values.get)
current_best_value = current_values[current_best_project]

current_df = (
    pd.DataFrame({
        "Projet": list(current_values.keys()),
        "Bénéfice net espéré (€)": list(current_values.values())
    })
    .sort_values("Bénéfice net espéré (€)", ascending=False)
    .reset_index(drop=True)
)

print("\n" + "=" * 70)
print("1. DÉCISION AVEC L'INFORMATION ACTUELLE")
print("=" * 70)
print(current_df.to_string(index=False))
print(f"\nProjet choisi aujourd'hui : {current_best_project}")
print(f"Valeur attendue : {current_best_value:,.0f} €")

theta_draws = rng.normal(mu0, sigma0, N_MC)
perfect_info_values = np.empty(N_MC)

for i, theta in enumerate(theta_draws):
    vals = [project_net_benefit(p, theta) for p in PROJECTS]
    perfect_info_values[i] = max(vals)

expected_value_perfect_info = perfect_info_values.mean()
EVPI = expected_value_perfect_info - current_best_value

print("\n" + "=" * 70)
print("2. EVPI — EXPECTED VALUE OF PERFECT INFORMATION")
print("=" * 70)
print(f"Valeur avec information parfaite : {expected_value_perfect_info:,.0f} €")
print(f"Valeur avec information actuelle : {current_best_value:,.0f} €")
print(f"EVPI : {EVPI:,.0f} €")

print(
    "\nInterprétation : l'EVPI est le montant maximal que le décideur "
    "devrait être prêt à payer pour éliminer entièrement l'incertitude "
    "sur theta avant de choisir le projet."
)

def posterior_parameters(sample_mean, n):
    prior_precision = 1 / sigma0**2
    data_precision = n / sigma_y**2
    post_var = 1 / (prior_precision + data_precision)
    post_mean = post_var * (
        prior_precision * mu0 +
        data_precision * sample_mean
    )
    return post_mean, np.sqrt(post_var)

def simulate_evsi(n, n_mc=40_000, seed=None):
    local_rng = np.random.default_rng(seed)
    theta = local_rng.normal(mu0, sigma0, n_mc)
    ybar = local_rng.normal(
        loc=theta,
        scale=sigma_y / np.sqrt(n),
        size=n_mc
    )
    prior_precision = 1 / sigma0**2
    data_precision = n / sigma_y**2
    post_var = 1 / (prior_precision + data_precision)
    post_mean = post_var * (
        prior_precision * mu0 +
        data_precision * ybar
    )
    posterior_values = np.column_stack([
        BASE_NET[p] + BETA[p] * (post_mean - theta_ref)
        for p in PROJECTS
    ])
    best_post_values = posterior_values.max(axis=1)
    expected_value_with_sample_info = best_post_values.mean()
    evsi = expected_value_with_sample_info - current_best_value
    return evsi, expected_value_with_sample_info

rows = []

for idx, n in enumerate(sample_sizes):
    evsi, value_with_sample = simulate_evsi(
        n=n,
        n_mc=50_000,
        seed=SEED + idx + 1
    )
    cost = study_fixed_cost + study_cost_per_obs * n
    enbs = evsi - cost
    rows.append({
        "n": n,
        "Valeur avec étude (€)": value_with_sample,
        "EVSI (€)": evsi,
        "Coût étude (€)": cost,
        "ENBS (€)": enbs
    })

results = pd.DataFrame(rows)

best_idx = results["ENBS (€)"].idxmax()
best_row = results.loc[best_idx]

print("\n" + "=" * 70)
print("3. EVSI ET ENBS SELON LA TAILLE DE L'ÉTUDE")
print("=" * 70)

print(
    results.round(0).to_string(
        index=False,
        formatters={
            "Valeur avec étude (€)": "{:,.0f}".format,
            "EVSI (€)": "{:,.0f}".format,
            "Coût étude (€)": "{:,.0f}".format,
            "ENBS (€)": "{:,.0f}".format,
        }
    )
)

print("\nTaille d'échantillon maximisant l'ENBS :")
print(f"n = {int(best_row['n'])}")
print(f"EVSI = {best_row['EVSI (€)']:,.0f} €")
print(f"Coût = {best_row['Coût étude (€)']:,.0f} €")
print(f"ENBS = {best_row['ENBS (€)']:,.0f} €")

plt.figure(figsize=(9, 5))
plt.plot(results["n"], results["EVSI (€)"], marker="o", label="EVSI")
plt.axhline(EVPI, linestyle="--", label="EVPI")
plt.xlabel("Taille de l'échantillon n")
plt.ylabel("Valeur de l'information (€)")
plt.title("EVSI selon la taille de l'étude")
plt.legend()
plt.grid(alpha=0.25)
plt.tight_layout()
plt.show()

plt.figure(figsize=(9, 5))
plt.plot(results["n"], results["EVSI (€)"], marker="o", label="EVSI")
plt.plot(results["n"], results["Coût étude (€)"], marker="s", label="Coût de l'étude")
plt.plot(results["n"], results["ENBS (€)"], marker="^", label="ENBS")
plt.axhline(0, linewidth=1)
plt.xlabel("Taille de l'échantillon n")
plt.ylabel("Euros")
plt.title("Valeur et coût de l'information")
plt.legend()
plt.grid(alpha=0.25)
plt.tight_layout()
plt.show()

theta_grid = np.linspace(mu0 - 3*sigma0, mu0 + 3*sigma0, 400)
plt.figure(figsize=(9, 5))

for p in PROJECTS:
    values = [
        project_net_benefit(p, theta)
        for theta in theta_grid
    ]
    plt.plot(theta_grid, values, label=p)

plt.axvline(mu0, linestyle="--", label="Moyenne a priori")
plt.xlabel("Paramètre d'efficacité θ")
plt.ylabel("Bénéfice net (€)")
plt.title("Projet optimal selon l'état du monde")
plt.legend()
plt.grid(alpha=0.25)
plt.tight_layout()
plt.show()

n_demo = 100
observed_sample_mean = 1.18

mu_post, sigma_post = posterior_parameters(
    observed_sample_mean,
    n_demo
)

post_values = expected_net_benefits(mu_post)
post_best = max(post_values, key=post_values.get)

posterior_df = pd.DataFrame({
    "Projet": list(post_values.keys()),
    "Bénéfice net posterior espéré (€)": list(post_values.values())
}).sort_values("Bénéfice net posterior espéré (€)", ascending=False)

print("\n" + "=" * 70)
print("4. EXEMPLE : APRÈS UNE ÉTUDE PILOTE OBSERVÉE")
print("=" * 70)
print(f"Taille d'étude : n = {n_demo}")
print(f"Moyenne observée : {observed_sample_mean:.3f}")
print(f"Moyenne a priori : {mu0:.3f}")
print(f"Moyenne a posteriori : {mu_post:.3f}")
print(f"Écart-type posterior : {sigma_post:.3f}")
print("\nDécision actualisée :")
print(posterior_df.to_string(index=False))
print(f"\nProjet choisi après l'étude : {post_best}")

print("\n" + "=" * 70)
print("5. SYNTHÈSE — COMITÉ D'INVESTISSEMENT")
print("=" * 70)

print(f"""
1. Sans nouvelle information :
   Projet retenu = {current_best_project}
   Valeur attendue = {current_best_value:,.0f} €

2. Valeur maximale d'une information parfaite :
   EVPI = {EVPI:,.0f} €

3. Étude la plus intéressante parmi les tailles testées :
   n = {int(best_row['n'])}
   EVSI = {best_row['EVSI (€)']:,.0f} €
   Coût = {best_row['Coût étude (€)']:,.0f} €
   ENBS = {best_row['ENBS (€)']:,.0f} €

4. Règle de décision :
   Si ENBS > 0, la valeur attendue de l'étude dépasse son coût.
   Si ENBS < 0, il vaut mieux décider avec l'information actuelle,
   sous les hypothèses du modèle.
""")
