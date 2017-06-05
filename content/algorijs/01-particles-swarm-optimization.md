+++
date = "2017-05-24T23:35:11+07:00"
keywords = ["viisix"]
summary = "PSO is an optimization technique using randomly positions and velocity of particles in a population."
algo_avatar = "PSO_2xsinx2_cropped.gif"
algo_avatar_summary = "Example PSO for `f(x)=2xsin(x^2)`"
title = "Particles Swarm Optimization"
js_libs = ["pso.js"]

+++

## About Particle Swarm Optimization (PSO)

PSO is one of the *swarm intelligent*'s algorithm which simulated
the movements of particles in a bird flock or fish school to perform an optimization
on a problem without mathematical solving. This algorithm is having an 
amazing speed on complex problems with many input elements or large area of search space. 

However, there is no guarantee that an optimal result is ever found or one
returned result is near the correct answer, which lead to another methods
are required to find the best result (for example run many time on one problem).

### The Algorithm

PSO algorithm work on a population of candidate solutions (a bird or fish
in the swarm) called particles. For each iteration steps, the particles will move
around within the searching space finding for the best answer, these particles' 
movements of the particles are guided by their own best known position and 
also the swarm best know position. After a while of repeating these steps, 
we will get the best answer for the problem in the search space 
(hopefully but not guaranteed).

#### Parameters
- **n**: number of the particle in a swarm
- **c1, c2**: learning factors that decide which best location have more
 effect on each particle - global best position or local best position
- **T**: number of iteration steps (other methods can be used to terminate the search)

#### Pseudo code

```text
# Initiation
for each particle do:
    generate particle's random position P_i_0
    generate particle's random velocity V_i_0
    set particle's local best position \
        P_i_best <- P_i_0
    
    if f(P_i) better than f(P_best):
        update swarm best known position \
            P_best <- P_i
        
t <- 0
while t < T:
    for each particle do:
        pick random number r_1, r_2
        update particle's velocity \
            V_i_t <- V_i_(t-1) + (c_1 * r_1 * (P_i_best - P_i_(t-1))) + (c_2 * r_2 * (P_best - P_i_(t-1)))
        update particle's position \
            P_i_t <- P_i_(t-1) + V_i_t
            
        if P_i_t > P_i_best:
            update particle's best known position \
                P_i_best <- P_i_t
            
        if P_i_t > P_best:
            update swarm's best known position \
                P_best <- P_i_t
    t <- t + 1
```
